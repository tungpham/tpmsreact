import Cookie from 'js-cookie';
import { Base64 } from 'js-base64';
import { parseQueryStringToObject } from '../core/str';
import Fetcher from '../core/fetcher';
import NotificationCenter from '../core/notification';

export default class Auth {

  constructor() {
    this.auth = null;
    this.auth0 = new auth0.WebAuth({ //eslint-disable-line
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      redirectUri: process.env.AUTH0_REDIRECT_URI,
      responseType: 'token id_token',
      scope: 'openid profile email user_metadata app_metadata picture'
    }); 
  }

  openAuthO() {
    this.auth0.authorize();
  }

  authOLoginCallback(params = null, callback) {
    if (!params) {
      return callback(null);
    }
    const parser = parseQueryStringToObject(params);

    if (!parser.expires_in && !parser['#access_token'] && !parser['id_token']) { // No valid params
      return callback(null);
    }
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify(
      (parser.expires_in * 1000) + new Date().getTime()
    );
    Cookie.set('access_token', parser['#access_token'], { expires: 60 });
    Cookie.set('id_token', parser['id_token'], { expires: 60 });
    Cookie.set('expires_at', expiresAt, { expires: 60 });

    this.getAuthFromAuthO(callback);
  }

  /**
   * Get auth from AuthO
   * @param callback
   */
  getAuthFromAuthO(callback) {
    if (this.auth) {
      callback(this.auth);
    }
    if (Cookie.get('access_token') && Auth.isAuthenticated()) {
      const accessToken = Cookie.get('access_token');
      this.auth0.client.userInfo(accessToken, (err, profile) => {
        if (err) {
          return callback(null);
        }
        if (profile) {
          if (localStorage.getItem('auth')) {
            const authDecoded = Base64.decode(localStorage.getItem('auth'));
            return callback(JSON.parse(authDecoded));
          }
          Fetcher.fetchAuth(profile).then(auth => {
            if (!auth) {
              NotificationCenter.warning('Your account is not setup! Please login with another account.');
              return callback(null);
            }
            this.auth = auth;
            const authEncoded = Base64.encode(JSON.stringify(this.auth));
            localStorage.setItem('auth', authEncoded);
            callback(this.auth);
          });
        }
      });
    } else {
      Cookie.remove('access_token');
      Cookie.remove('id_token');
      Cookie.remove('expires_at');
      Cookie.remove('api_access_token');
      localStorage.removeItem('auth');
      callback(null);
    }
  }

  static logout() {
    Cookie.remove('access_token');
    Cookie.remove('id_token');
    Cookie.remove('expires_at');
    Cookie.remove('api_access_token');
  }

  static isAuthenticated() {
    if (!Cookie.get('expires_at')) {
      return false;
    }
    const expiresAt = JSON.parse(Cookie.get('expires_at'));
    if (new Date().getTime() > expiresAt) {
      Cookie.remove('access_token');
      Cookie.remove('id_token');
      Cookie.remove('expires_at');
      Cookie.remove('api_access_token');
      localStorage.removeItem('auth');
      return false;
    }
    return true;
  }
}