import actions from "../actions";
import { handleActions } from "redux-actions";
import { Map } from "immutable";

export default handleActions(
  {
    [actions.notifications.add]: (
      state,
      { payload: { path, type, message, id } }
    ) => state.setIn([path, id], Map({ type, message })),
    [actions.notifications.remove]: (state, { payload: { path, id } }) =>
      state.removeIn([path, id])
  },
  Map()
);
