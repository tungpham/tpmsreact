import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { reducer as formReducer } from 'redux-form/immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import UserReducerProvider from './reducers/user';
import AppReducerProvider from './reducers/app';

const routeInitialState = fromJS({
  locationBeforeTransitions: null,
});

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      return state.merge({
        locationBeforeTransitions: action.payload,
      });
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers) {
  return combineReducers({
    route: routeReducer,
    form: formReducer,
    app: AppReducerProvider,
    user: UserReducerProvider,
    ...asyncReducers,
  });
}
