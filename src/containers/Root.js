import React from "react";
import { Provider as Redux, connect } from "react-redux";
import { Route, Redirect } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/SignIn";
import Register from "./pages/SignUp";
import Profile from "./pages/Profile";
import NumberSettings from "./pages/NumberSettings";
import Usage from "./pages/Usage";
import Search from "./pages/Search";
import Balance from "./pages/Balance";
import Container from "./Container";
import Auth from '../auth/Auth';
import actions from "../actions";

import configureStore from "../lib/configureStore";
import createHistory from "history/createHashHistory";
import { routerMiddleware } from "react-router-redux";
const initalState = window.__INITIAL_STATE__;
const history = createHistory();
const store = configureStore({
  initalState,
  platformMiddleware: [routerMiddleware(history)],
  platformDeps: { history }
});

export const getAuthenticatedUser = () => {

  let auth = new Auth();
  let authCheck = auth.isAuthenticated();

  authCheck.then((profile) => {
    console.info('%cProfile information has successfully been retrieved for the current user.','font-size:40px; color:#3CA2D1');
    console.info(profile);
    store.dispatch(actions.user.userData.success(profile.clientID, profile));
  });

  authCheck.catch((err) => {
    console.error('%cYou have failed to authenticate and have been redirected to the login page.','font-size:40px; color:#CE513B');
    console.error(err);
    window.location.href = process.env.AUTH0_REDIRECT_URI+'login';
  });

};

export const Root = ({ history, store }) => (
  <Redux store={store}>
    <ConnectedRouter history={history}>
      <Container>
        <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
        <Route
          exact
          path="/dashboard/:number?/:type?/:conversation?"
          render={() => {
              getAuthenticatedUser();
              return <Dashboard />
          }}
        />
        <Route
          path="/profile"
          render={() => {
              getAuthenticatedUser();
              return <Profile />
          }}
        />
        <Route
          path="/settings/:number?"
          render={() => {
              getAuthenticatedUser();
              return <NumberSettings />
          }}
        />
        <Route
          path="/balance/:number"
          render={() => {
              getAuthenticatedUser();
              return <Balance />
          }}
        />
        <Route
          path="/usage/:number?/:type?"
          render={() => {
              getAuthenticatedUser();
              return <Usage />
          }}
        />
        <Route
          path="/search"
          render={() => {
              getAuthenticatedUser();
              return <Search />
          }}
        />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Container>
    </ConnectedRouter>
  </Redux>
);

export default Root;
