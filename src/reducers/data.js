import actions from "../actions";
import { handleActions } from "redux-actions";
import { combineReducers } from "redux-immutable";
import { Map, Record, List } from "immutable";

export const InitialState = Record({
  data: Map(),
  entities: Map()
});

export const DataPoint = Record({
  loading: false,
  loaded: false,
  type: "",
  data: null,
  error: null
});

function ensureArray(data) {
  return Array.isArray(data) ? data : [data];
}

const getType = type => ensureArray(type);

export const getPath = type => getType(type).join(".");

function addEntities(state, { data: { normalized } }) {
  if (!normalized) return state;

  function mergeFn(prev, next) {
    if (List.isList(next)) return next;
    if (!Map.isMap(next)) return next;

    return next.mergeWith(mergeFn, prev);
  }

  return state.mergeWith(mergeFn, normalized.entities);
}

function removeEntities(state, { data }) {
  return state.withMutations(state => {
    data.forEach(({ type, id }) => state.removeIn([getPath(type), id]));
  });
}

function createDataPoint(state, { type, reset }) {
  if (!type) return state;

  const name = getPath(type);

  if (state.has(name) && reset !== true) {
    return state.update(name, dataPoint => dataPoint.set("loading", true));
  }

  return state.set(name, DataPoint({ loading: true }));
}

function setDataPointData(state, { data: { raw, normalized }, type }) {
  if (!type) return state;

  const name = getPath(type);

  if (!state.has(name)) return state;

  return state.update(name, dataPoint =>
    dataPoint.merge({
      loading: false,
      loaded: true,
      error: null,
      data: normalized ? normalized.result : raw
    })
  );
}

function setDataPointError(state, { error, type }) {
  if (!type) return state;

  const name = getPath(type);

  if (!state.has(name)) return state;

  return state.update(name, dataPoint =>
    dataPoint.merge({
      data: null,
      //entities: List(),
      error
    })
  );
}

export default combineReducers(
  {
    data: handleActions(
      {
        [actions.data.request]: (state, action) =>
          createDataPoint(state, action.payload),
        [actions.data.success]: (state, action) =>
          setDataPointData(state, action.payload),
        [actions.data.fail]: (state, action) =>
          setDataPointError(state, action.payload)
      },
      Map()
    ),
    entities: handleActions(
      {
        [actions.data.success]: (state, action) =>
          addEntities(state, action.payload),
        [actions.data.entities.add]: (state, action) =>
          addEntities(state, action.payload),
        [actions.data.entities.remove]: (state, action) =>
          removeEntities(state, action.payload)
      },
      Map()
    )
  },
  InitialState
);
