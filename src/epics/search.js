import actions from "../actions";
import { formEpic } from "./data";

const search = ({ payload: { search } }, deps) =>
  deps
    .authAjax(deps.getState())({
      url: "/api/search",
      body: search,
      method: "POST"
    })
    .map(x => x.response);

const searchEpic = formEpic({
  form: "search",
  type: "search",
  requestActionType: String(actions.search.request),
  workFn: search,
  successAction: actions.search.success,
  failAction: err => actions.search.fail(err)
});

export default [searchEpic];
