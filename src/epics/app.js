import actions from "../actions";
import { Observable } from "rxjs/Observable";

const appStartedEpic = (action$, deps) => {
  const streams = [];

  return action$
    .ofType(String(actions.app.started))
    .mergeMap(() => Observable.merge(...streams));
};

export default [appStartedEpic];
