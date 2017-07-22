import validate from "../validate";
import { ajax } from "rxjs/observable/dom/ajax";

const configureDeps = (initialState, platformDeps) => ({
  ...platformDeps,
  getUid: () => platformDeps.uuid.v4(),
  now: () => Date.now(),
  validate,
  ajax,
  jsonAjax: properties =>
    ajax({
      ...properties,
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }),
  authAjax: state => properties =>
    ajax({
      ...properties,
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${state.user.get("token")}`
      }
    })
});

export default configureDeps;
