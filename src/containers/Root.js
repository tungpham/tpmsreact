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

export const AuthRoute = (() => {
  const AuthRoute = ({
    location,
    authenticated,
    component: Component,
    ...rest
  }) => (
    <Route
      {...rest}
      render={props =>
        (authenticated
          ? <Component {...props} />
          : <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />)}
    />
  );

  const enhance = connect(state => ({
    authenticated: state.user.authenticated,
    location: state.router
  }));

  return enhance(AuthRoute);
})();

export const Root = ({ history, store }) => (
  <Redux store={store}>
    <ConnectedRouter history={history}>
      <Container>
        <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
        <AuthRoute
          path="/dashboard/:number?/:type?/:conversation?"
          component={Dashboard}
        />
        <AuthRoute path="/profile" component={Profile} />
        <AuthRoute path="/settings/:number?" component={NumberSettings} />
        <AuthRoute path="/balance/:number" component={Balance} />
        <AuthRoute path="/usage/:number?/:type?" component={Usage} />
        <AuthRoute path="/search" component={Search} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Container>
    </ConnectedRouter>
  </Redux>
);

export default Root;
