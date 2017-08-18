import actions from "../actions";
import { handleActions } from "redux-actions";
import { fromJS, Record } from "immutable";

const InitialState = Record({
  authenticated: false,
  error: null,
  token: "",
  data: null
});

const signIn = (state, action) => {

  state
    .set("token", action.payload.token)
    .set("data", fromJS(action.payload.data))
    .set("authenticated", true);
};

const setUserData = (state, action) => {
  console.log('SETTING USER TO LOGGED IN');
  state
    .set("token", action.payload.token)
    .set("data", fromJS(action.payload.data))
    .set("authenticated", true);
};


export default handleActions(
  { 
    [actions.user.signIn.success]: signIn,
    [actions.user.userData.set]: setUserData,
    [actions.user.edit.success]: (state, { payload: { user } }) =>
      state.set("data", fromJS(user))
  },
  InitialState()
);
