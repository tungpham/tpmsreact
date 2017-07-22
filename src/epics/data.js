import actions from "../actions";
import { normalize } from "normalizr";
import { Observable } from "rxjs/Observable";
import { startSubmit, stopSubmit } from "redux-form/immutable";

export const dataEpic = ({
  type,
  requestActionType,
  successAction,
  failAction,
  schema,
  workFn,
  onRequest,
  onSuccess,
  onFail
}) => (action$, deps) => {
  return action$.ofType(requestActionType).mergeMap(action => {
    const t = typeof type === "function" ? type(action) : type;
    const dataObservable = Observable.of(actions.data.request(t, false));
    const requestObservable = onRequest
      ? onRequest(action, deps)
      : Observable.empty();

    const baseObservable = workFn(action, deps)
      .delay(1000) // TODO: REMOVE!!!
      .mergeMap(data => {
        const successObservable = onSuccess
          ? onSuccess(data, action, deps)
          : Observable.empty();
        const baseObservable = Observable.of(
          actions.data.success(
            t,
            data,
            schema ? normalize(data, schema) : null
          ),
          successAction(data, action)
        );

        return Observable.merge(successObservable, baseObservable);
      })
      .catch(err => {
        const errorObservable = onFail
          ? onFail(err, action, deps)
          : Observable.empty();
        const baseObservable = Observable.of(
          actions.data.fail(t, err),
          failAction(err, action)
        );

        return Observable.merge(errorObservable, baseObservable);
      });

    return Observable.merge(dataObservable, requestObservable, baseObservable);
  });
};

export const formEpic = ({ form, onRequest, onSuccess, onFail, ...props }) =>
  dataEpic({
    ...props,
    onRequest: (action, deps) => {
      const t = typeof form === "function" ? form(action) : form;
      const requestObservable = onRequest
        ? onRequest(action, deps)
        : Observable.empty();
      const actionObservable = Observable.of(startSubmit(t));

      return Observable.merge(requestObservable, actionObservable);
    },
    onSuccess: (data, action, deps) => {
      const t = typeof form === "function" ? form(action) : form;
      const successObservable = onSuccess
        ? onSuccess(action, deps)
        : Observable.empty();
      const actionObservable = Observable.of(stopSubmit(t));

      return Observable.merge(successObservable, actionObservable);
    },
    onFail: (error, action, deps) => {
      const t = typeof form === "function" ? form(action) : form;
      const failObservable = onFail ? onFail(action, deps) : Observable.empty();
      const actionObservable = Observable.of(stopSubmit(t));

      return Observable.merge(failObservable, actionObservable);
    }
  });
