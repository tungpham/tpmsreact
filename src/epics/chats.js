import actions from "../actions";
import { dataEpic } from "./data";
import { schema } from "normalizr";
import { numberSchema } from "./numbers";
import { Observable } from "rxjs/Observable";
import { push } from "react-router-redux";

export const chatSchema = new schema.Entity("chats", {
  from: numberSchema,
  to: numberSchema
});

const loadChats = (action, deps) =>
  deps
    .authAjax(deps.getState())({
      url: "/api/chats/" + action.payload.id
    })
    .map(x => x.response);

const loadEpic = dataEpic({
  type: action => `number.${action.payload.id}.chats`,
  requestActionType: String(actions.chats.load.request),
  schema: new schema.Array(chatSchema),
  workFn: loadChats,
  successAction: (data, action) =>
    actions.chats.load.success(action.payload.id, data),
  failAction: (err, action) => actions.chats.load.fail(action.payload.id, err)
});

const loadMessages = ({ payload: { from, to } }, deps) =>
  deps
    .authAjax(deps.getState())({
      url: `/api/chat/${from}/${to}/conversation/messages`
    })
    .map(x => x.response);

const messagesLoadEpic = dataEpic({
  type: ({ payload: { from, to } }) => `number.${from}.${to}.chats.messages`,
  requestActionType: String(actions.chats.messages.load.request),
  successAction: (data, { payload: { from, to } }) =>
    actions.chats.messages.load.success(from, to, data),
  failAction: (err, { payload: { from, to } }) =>
    actions.chats.messages.load.fail(from, to, err),
  workFn: loadMessages
});

const sendMessage = ({ payload: { from, to, message } }, deps) =>
  deps
    .authAjax(deps.getState())({
      method: "POST",
      url: `/api/chat/${from}/${to}/conversation`,
      body: { message: message.message }
    })
    .map(x => x.response);

const sendMessageEpic = dataEpic({
  type: ({ payload: { from, to } }) =>
    `number.${from}.${to}.chats.message.send`,
  requestActionType: String(actions.chats.messages.send.request),
  workFn: sendMessage,
  successAction: (data, { payload: { from, to } }) =>
    actions.chats.messages.send.success(from, to, data),
  failAction: (err, { payload: { from, to } }) =>
    actions.chats.messages.send.fail(from, to, err)
});

const createConversation = ({ payload: { from, toNumber, message } }, deps) =>
  deps
    .authAjax(deps.getState())({
      method: "POST",
      url: `/api/chat/${from}/${toNumber}/conversation`,
      body: { message }
    })
    .map(x => x.response);

const sendConversationEpic = dataEpic({
  type: ({ payload: { from, toNumber } }) =>
    `number.${from}.${toNumber}.conversation.request`,
  requestActionType: String(actions.chats.conversation.send.request),
  workFn: createConversation,
  schema: chatSchema,
  successAction: (data, { payload: { from, toNumber } }) =>
    actions.chats.conversation.send.success(from, data.id, data),
  failAction: (err, { payload: { from, toNumber } }) =>
    actions.chats.conversation.send.fail(from, toNumber, err)
});

const sendConversationSuccessEpic = (action$, deps) =>
  action$
    .ofType(String(actions.chats.conversation.send.success))
    .mergeMap(({ payload: { from, to } }) => {
      return Observable.merge(
        Observable.of(push(`/dashboard/${from}/conversation/${to}`)),
        Observable.of(push(`/dashboard`)).delay(100)
      );
    });

export default [
  loadEpic,
  messagesLoadEpic,
  sendMessageEpic,
  sendConversationEpic,
  sendConversationSuccessEpic
];
