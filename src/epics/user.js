import actions from "../actions";
import { Observable } from "rxjs/Observable";
import { push } from "react-router-redux";
import { formEpic } from "./data";

const signIn = ({ payload: { provider, options } }, deps) =>
  deps
    .jsonAjax({
      url: "/api/login",
      body: { provider, options },
      method: "POST"
    })
    .map(x => x.response);

const signInEpic = formEpic({
  form: "signIn",
  type: "signIn",
  requestActionType: String(actions.user.signIn.request),
  workFn: signIn,
  successAction: ({ token, user }, action) =>
    actions.user.signIn.success(token, user),
  failAction: actions.user.signIn.fail
});

const onSignInEpic = (action$, deps) =>
  action$.ofType(String(actions.user.signIn.success)).map(() => push("/"));

const edit = ({ payload: { user } }, deps) =>
  deps
    .authAjax(deps.getState())({
      url: "/api/user",
      body: user,
      method: "PUT"
    })
    .map(x => x.response);

const editEpic = formEpic({
  form: "profile",
  type: "profile.edit",
  requestActionType: String(actions.user.edit.request),
  workFn: edit,
  successAction: actions.user.edit.success,
  failAction: actions.user.edit.fail
});

const signUp = ({ payload: { provider, options } }, deps) =>
  deps
    .jsonAjax({
      url: "/api/register",
      body: { provider, options },
      method: "POST"
    })
    .map(x => x.response);

const signUpEpic = formEpic({
  form: "signUp",
  type: "signUp",
  requestActionType: String(actions.user.signUp.request),
  workFn: signUp,
  successAction: ({ token, user }) => actions.user.signUp.success(token, user),
  failAction: actions.user.signUp.fail,
  onSuccess: ({ token, user }) =>
    Observable.of(actions.user.signIn.success(token, user))
});

const logoutEpic = (action$, deps) =>
  action$
    .ofType(String(actions.user.signOut.request))
    .mergeMap(() => Observable.of(push("/")));

export default [logoutEpic, signUpEpic, signInEpic, onSignInEpic, editEpic];
