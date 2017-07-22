import actions from "../actions";
import { handleActions } from "redux-actions";
import { Record } from "immutable";

const InitialState = Record({
  started: false,
  menuShown: false
});

export default handleActions(
  {
    [actions.app.started]: state => state.set("started", true),
    [actions.app.toggleMenu]: (state, action) =>
      state.set(
        "menuShown",
        action.payload.menuShown !== undefined
          ? action.payload.menuShown
          : !state.get("menuShown")
      )
  },
  InitialState()
);
