import actions from "../actions";
import { handleActions } from "redux-actions";
import { Map } from "immutable";

export default handleActions(
  {
    [actions.fields.resetFields]: (state, action) =>
      state.removeIn(action.payload.path),
    [actions.fields.setField]: (state, { payload: { path, value } }) =>
      state.setIn(path, value)
  },
  Map()
);
