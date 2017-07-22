import actions from "../actions";
import { handleActions } from "redux-actions";
import { Map, List, fromJS } from "immutable";

export default handleActions(
  {
    [actions.chats.messages.load.success]: (
      state,
      { payload: { from, to, data } }
    ) => state.updateIn([from, to], List(), list => fromJS(data)),
    [actions.chats.messages.send.request]: (
      state,
      { payload: { from, to, message } }
    ) => state.updateIn([from, to], List(), list => list.push(fromJS(message)))
  },
  Map()
);
