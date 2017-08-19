import Auth0Lock from 'auth0-lock';
import actions from "../actions";
import configureStore from "../lib/configureStore";
import createHistory from "history/createHashHistory";
import { routerMiddleware } from "react-router-redux";
const initalState = window.__INITIAL_STATE__;
const history = createHistory();

export default class Auth {

  auth0 = new Auth0Lock(
    process.env.AUTH0_CLIENT_ID,
    process.env.AUTH0_DOMAIN,
    {
      redirect: false
    }
  );

  store = configureStore({
    initalState,
    platformMiddleware: [routerMiddleware(history)],
    platformDeps: { history }
  });

  constructor()
  {
    this.login = this.login.bind(this);

    this.auth0.on("authenticated", (authResult) => {
      localStorage.setItem('accessToken', authResult.accessToken);
      console.info('%cYou have been successfully authenticated.','font-size:40px; color:#3CA2D1');
      window.location.href = process.env.AUTH0_REDIRECT_URI+'dashboard';
      /**
       * This needs looking at, basically dispatch the user sign in action when you have been authenticated;
       */
      this.store.dispatch(actions.user.signIn.success(authResult.accessToken, {}));
    });
  }

  login() {
    this.auth0.show();
  }

  logout() {
    this.auth0.logout({
      returnTo: process.env.AUTH0_REDIRECT_URI
    });
  }

  isAuthenticated() {
      return new Promise((resolve, reject) => {
        if(localStorage.getItem('accessToken') !== null){
          this.auth0.getUserInfo(localStorage.getItem('accessToken'), (error, profile) => {
            if (error) {
              reject(error);
            }
            resolve(profile)
          })
        }else{
          reject('No accessToken');
        }
      });
    }
}