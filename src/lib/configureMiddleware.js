import configureDeps from "./configureDeps";
import configureEpics from "./configureEpics";
import { createLogger } from "redux-logger";
import { createEpicMiddleware } from "redux-observable";

// Like redux-thunk, but with just one argument for dependencies.
const injectMiddleware = deps => ({ dispatch, getState }) => next => action =>
  next(
    typeof action === "function"
      ? action({ ...deps, dispatch, getState })
      : action
  );

const configureMiddleware = (
  initialState,
  platformDeps,
  platformMiddleware
) => {
  const deps = configureDeps(initialState, platformDeps);
  const rootEpic = configureEpics(deps);
  const epicMiddleware = createEpicMiddleware(rootEpic);

  const middleware = [
    injectMiddleware(deps),
    epicMiddleware,
    ...platformMiddleware
  ];

  const enableLogger = process.env.NODE_ENV !== "production";

  // Logger must be the last middleware in chain.
  if (enableLogger) {
    const logger = createLogger({
      collapsed: true,
      stateTransformer: state => state && state.toJS()
    });
    middleware.push(logger);
  }

  if (module.hot && typeof module.hot.accept === "function") {
    module.hot.accept("./configureEpics", () => {
      const configureEpics = require("./configureEpics").default;

      epicMiddleware.replaceEpic(configureEpics(deps));
    });
  }

  return middleware;
};

export default configureMiddleware;
