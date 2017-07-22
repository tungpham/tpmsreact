import "rxjs";
import { combineEpics } from "redux-observable";
import epics from "../epics";

const configureEpics = deps => (action$, { getState }) =>
  combineEpics(...epics)(action$, { ...deps, getState });

export default configureEpics;
