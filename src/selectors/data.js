import { Map, List } from "immutable";
import { getPath, DataPoint } from "../reducers/data";

const getState = state => state.data;

export const getDataState = (state, type) =>
  getState(state).data.get(getPath(type), DataPoint());

export const isLoading = (state, type) => getDataState(state, type).loading;

export const isLoaded = (state, type) => getDataState(state, type).loaded;

export const getData = (state, type) => getDataState(state, type).data;

export const getById = (state, type, id) =>
  getState(state).entities.getIn([getPath(type), id]);

export const getEntitiesObj = (state, type) =>
  getState(state).entities.get(getPath(type), Map());

export const getEntities = (state, type) =>
  getEntitiesObj(state, type).valueSeq();

export const getEntitiesByData = (state, dataType, entitiesType) => {
  const data = getDataState(state, dataType);
  const entities = getEntitiesObj(state, entitiesType);

  return (data.get("data") || List()).map(x => entities.get(x));
};

export const hasError = (state, type) => !!getDataState(state, type).error;

export const getError = (state, type) => getDataState(state, type).error;
