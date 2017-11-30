import React from 'react';
import { Provider as Redux } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import Dashboard from './pages/Dashboard';
import Login from './pages/SignIn';
import Profile from './pages/Profile';
import NumberSettings from './pages/NumberSettings';
import Usage from './pages/Usage';
import OAuthCallback from './pages/OAuthCallback';
import Search from './pages/Search';
import Balance from './pages/Balance';
import Container from './Container';
import Auth from '../auth/Auth';
import { loggedIn, loggedOut } from '../actions/user';
import runSagas from '../sagas';

const auth = new Auth();

export const Root = ({ history, store }) => {

  runSagas(store);

  const event = new CustomEvent('appLoaded', { });

  if (window.location.pathname === '/callback/oauth') {
    setTimeout(() => {
      document.dispatchEvent(event);
    }, 500);
  } else {
    auth.getAuthFromAuthO(auth => {
      if (auth) {
        store.dispatch(loggedIn({ profile: auth }));
      } else {
        history.push('/login');
        store.dispatch(loggedOut());
      }
      setTimeout(() => {
        document.dispatchEvent(event);
      }, 500);
    });
  }

  return (
    <Redux store={store}>
      <ConnectedRouter history={history}>
        <Container>
          <Route exact path="/" render={() => <Redirect to={'/dashboard'} />} />
          <Route
            exact
            path="/dashboard/:number?/:type?/:conversation?"
            render={() => {
              if (!Auth.isAuthenticated()) {
                return <Redirect to={'/login'} />
              }
              return <Dashboard />
            }}
          />
          <Route
            path="/profile"
            render={() => {
              if (!Auth.isAuthenticated()) {
                return <Redirect to={'/login'} />
              }
              return <Profile />
            }}
          />
          <Route
            path="/settings/:number?"
            render={() => {
              if (!Auth.isAuthenticated()) {
                return <Redirect to={'/login'} />
              }
              return <NumberSettings />
            }}
          />
          <Route
            path="/balance/:number"
            render={() => {
              if (!Auth.isAuthenticated()) {
                return <Redirect to={'/login'} />
              }
              return <Balance />
            }}
          />
          <Route
            path="/usage/:number?/:type?"
            render={() => {
              if (!Auth.isAuthenticated()) {
                return <Redirect to={'/login'} />
              }
              return <Usage />
            }}
          />
          <Route
            path="/search"
            render={() => {
              if (!Auth.isAuthenticated()) {
                return <Redirect to={'/login'} />
              }
              return <Search />
            }}
          />
          <Route path="/login" component={Login} />
          <Route exact path="/callback/oauth" component={OAuthCallback} />
        </Container>
      </ConnectedRouter>
    </Redux>
  )
};

export default Root;
