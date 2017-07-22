import React from "react";
import * as selectors from "../selectors/data";
import actions from "../actions";
import fetch from "../lib/fetch";
import {
  compose,
  pure,
  branch,
  renderComponent,
  withHandlers
} from "recompose";
import { connect } from "react-redux";
import { List, Map } from "immutable";
import moment from "moment";
import ScrollToBottom from "./ScrollToBottom";
import SendMessage from "./SendMessage";

const nl2br = text =>
  text.split("\n").map((item, key) => <span key={key}>{item}<br /></span>);

export const MessageView = ({
  state,
  messages,
  from,
  fromNumber,
  toNumber,
  onMessage
}) => (
  <ScrollToBottom className="messages-view">
    <div className="messages-list">
      {messages.map((message, i) => {
        const local = message.get("from") === from;
        const number = local ? fromNumber : toNumber;

        return (
          <div
            className={
              "message-box d-flex" +
                (local ? " local flex-row-reverse" : " remote flex-row")
            }
            key={i}
          >
            <div className="message-avatar">
              <img
                src={number.get("avatar")}
                alt="avatar"
                className="avatar rounded-circle"
              />
            </div>
            <div className="message-container">
              <div className="message-text">
                {nl2br(message.get("message"))}
              </div>
              <div className="message-date">
                {moment(message.get("date")).format("h:mm a")}
              </div>
            </div>
          </div>
        );
      })}
    </div>
    <SendMessage onMessage={onMessage} />
  </ScrollToBottom>
);

export const enhance = compose(
  branch(({ from, to }) => from == null || to == null, renderComponent("div")),
  connect((state, { from, to }) => {
    const selector = `number.${from}.${to}.chats.messages`;
    const dataState = selectors.getDataState(state, selector);

    return {
      state: dataState,
      fromNumber: selectors.getById(state, "numbers", from) || Map(),
      toNumber: selectors.getById(state, "numbers", to) || Map(),
      messages: state.messages.getIn([from, to]) || List()
    };
  }),
  fetch(
    ({ dispatch, from, to }) =>
      dispatch(actions.chats.messages.load.request(from, to)),
    ({ state }) => state.loaded,
    (p, np) => p.from !== np.from || p.to !== np.to
  ),
  withHandlers({
    onMessage: ({ dispatch, from, to }) => message =>
      dispatch(
        actions.chats.messages.send.request(from, to, {
          from,
          to,
          date: String(new Date()),
          message
        })
      )
  }),
  pure
);

export default enhance(MessageView);
