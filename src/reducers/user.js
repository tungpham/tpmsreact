import { fromJS } from 'immutable';
import * as types from '../constants';

const initialState = fromJS({
  authenticated: false,
  error: null,
  token: null,
  profile: { }
});
function UserReducer(state = initialState, action) {
  switch (action.type) {

    case types.LOGGED_IN:
      return state
        .set('profile', fromJS(action.payload.profile))
        .set('token', action.payload.token)
        .set('authenticated', true);

    case types.LOGGED_OUT:
      return state
        .set('profile', fromJS({}))
        .set('token', '')
        .set('authenticated', false);

    default:
      return state;
  }
}

export default UserReducer;
