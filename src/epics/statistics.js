import actions from "../actions";
import { dataEpic } from "./data";
import { schema } from "normalizr";

export const numberSchema = new schema.Entity("numbers");

const loadStatistics = (action, deps) =>
  deps
    .authAjax(deps.getState())({
      url: "/api/statistics/" + action.payload.id
    })
    .map(x => x.response);

const loadEpic = dataEpic({
  type: action => `number.${action.payload.id}.statistics`,
  requestActionType: String(actions.statistics.load.request),
  workFn: loadStatistics,
  successAction: (data, action) =>
    actions.statistics.load.success(action.payload.id, data),
  failAction: (err, action) =>
    actions.statistics.load.fail(action.payload.id, err)
});

export default [loadEpic];
