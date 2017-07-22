import { handleActions } from "redux-actions";
import { Record } from "immutable";

const InitialState = Record({
  locationBeforeTransitions: null
});

export default handleActions(
  {
    "@@router/LOCATION_CHANGE": (state, { payload }) =>
      state.set("locationBeforeTransitions", payload)
  },
  InitialState()
);
