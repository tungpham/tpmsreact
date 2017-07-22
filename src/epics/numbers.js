import actions from "../actions";
import { dataEpic, formEpic } from "./data";
import { schema } from "normalizr";

export const numberSchema = new schema.Entity("numbers");

const loadNumbers = (action, deps) =>
  deps
    .authAjax(deps.getState())({
      url: "/api/numbers"
    })
    .map(x => x.response);

const loadEpic = dataEpic({
  type: "numbers",
  requestActionType: String(actions.numbers.load.request),
  schema: new schema.Array(numberSchema),
  workFn: loadNumbers,
  successAction: actions.numbers.load.success,
  failAction: actions.numbers.load.fail
});

const editNumber = ({ payload: { id, data } }, deps) =>
  deps
    .authAjax(deps.getState())({
      url: "/api/number/" + id,
      body: data,
      method: "PUT"
    })
    .map(x => x.response);

const editEpic = formEpic({
  form: ({ payload: { id } }) => `numbers.edit.${id}`,
  type: ({ payload: { id } }) => `numbers.edit.${id}`,
  requestActionType: String(actions.numbers.edit.request),
  schema: numberSchema,
  workFn: editNumber,
  successAction: actions.numbers.edit.success,
  failAction: (err, { payload: { id } }) => actions.numbers.edit.fail(id, err)
});

export default [loadEpic, editEpic];
