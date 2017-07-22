import configureMiddleware from "./configureMiddleware";
import configureReducer from "./configureReducer";
import { applyMiddleware, createStore, compose } from "redux";

const configureStore = options => {
  const {
    initialState,
    platformDeps = {},
    platformMiddleware = [],
    platformReducers = {},
    platformStoreEnhancers = []
  } = options;

  const reducer = configureReducer(platformReducers, initialState);

  const middleware = configureMiddleware(
    initialState,
    platformDeps,
    platformMiddleware
  );

  const store = createStore(
    reducer,
    initialState,
    compose(applyMiddleware(...middleware), ...platformStoreEnhancers)
  );

  // Enable hot reloading for reducers.
  if (module.hot && typeof module.hot.accept === "function") {
    // Webpack for some reason needs accept with the explicit path.
    module.hot.accept("./configureReducer", () => {
      const configureReducer = require("./configureReducer").default;

      store.replaceReducer(configureReducer(platformReducers, initialState));
    });
  }

  return store;
};

export default configureStore;
