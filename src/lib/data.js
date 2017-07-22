import { connect } from "react-redux";
import { getById, getEntitiesObj } from "../selectors/data";

export const withEntities = types =>
  connect(state =>
    types.reduce((p, type) => ((p[type] = getEntitiesObj(state, type)), p), {})
  );

export const withEntity = (type, idFn) =>
  connect((state, props) => ({
    entity: getById(state, type, idFn(props))
  }));
