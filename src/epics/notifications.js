import actions from "../actions";
import { Observable } from "rxjs/Observable";

const notificationEpic = (action$, deps) =>
  action$
    .ofType(String(actions.notifications.add))
    .filter(({ payload: { duration } }) => duration !== undefined)
    .mergeMap(ac => {
      const { payload: { duration } } = ac;

      return Observable.of(ac).delay(duration);
    })
    .map(({ payload: { path, id } }) => actions.notifications.remove(path, id));

export default [notificationEpic];
