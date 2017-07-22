import React from "react";
import ReactDOM from "react-dom";
import Root from "./containers/Root";
import configureStore from "./lib/configureStore";
import createHistory from "history/createHashHistory";
import { routerMiddleware } from "react-router-redux";
import { AppContainer } from "react-hot-loader";
import actions from "./actions";

import "./index.scss";

const initalState = window.__INITIAL_STATE__;

const history = createHistory();

const store = configureStore({
  initalState,
  platformMiddleware: [routerMiddleware(history)],
  platformDeps: { history }
});

ReactDOM.render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById("root")
);

store.dispatch(actions.app.started());

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept("./containers/Root", () => {
    const NextRoot = require("./containers/Root").default;
    ReactDOM.render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById("root")
    );
  });
}
