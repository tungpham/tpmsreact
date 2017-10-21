import * as types from '../constants';

export function loggedIn(payload) {
  return {
    type: types.LOGGED_IN,
    payload
  };
}

export function loggedOut(payload) {
  return {
    type: types.LOGGED_OUT,
    payload
  };
}