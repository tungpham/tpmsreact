import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root';
import configureStore from './store';
import createHistory from 'history/createBrowserHistory';
import { AppContainer } from 'react-hot-loader';

import './index.scss';

const initialState = window.__INITIAL_STATE__;

const history = createHistory();

const store = configureStore(initialState, history);

ReactDOM.render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById("root")
);

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
