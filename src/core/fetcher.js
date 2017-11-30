import Cookie from 'js-cookie';

class Fetcher {


  constructor() {
    this.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  /**
   * Build header
   */
  buildHeaders() {
    this.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    return this.getApiToken().then(token => {
      this.headers['Authorization'] = `Bearer ${token}`;
      return this.headers;
    });
  }

  getApiToken() {
    if (Cookie.get('api_access_token')) {
      return new Promise(resolve => resolve(Cookie.get('api_access_token')));
    }
    return fetch('/stream', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'POST',
        url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        audience: process.env.AUTH0_API_AUDIENCE,
        grant_type: process.env.AUTH0_API_GRANT_TYPE,
        client_id: process.env.AUTH0_API_CLIENT_ID,
        client_secret: process.env.AUTH0_API_CLIENT_SECRET,
      }),
    }).then(response => {
      return response.json();
    }).then(response => {
      const apiToken = response.access_token;
      if (apiToken && apiToken !== undefined) {
        Cookie.set('api_access_token', apiToken, { expires: 1 }); // Expires in 1 day
        return apiToken;
      }
      return null;
    });
  }

  fetchUserMetaData(profile) {
    return fetch('/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookie.get('id_token')}`
      },
      body: JSON.stringify({
        method: 'GET',
        url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${profile.sub}?fields=user_metadata&include_fields=true`
      })
    }).then(response => response.json());
  }

  fetchAuth(profile) {
    return this.fetchUserMetaData(profile).then(response => {
      if (!response.user_metadata || !response.user_metadata.sid || !response.user_metadata.auth_token) {
        return null;
      }
      const userMetadata = response.user_metadata;
      const userData = {
        accountSid: userMetadata.sid,
        authToken: userMetadata.auth_token,
        email: profile.email,
        createdAt: 0,
        updatedAt: 0,
        platform: 'Web'
      };
      return this.buildHeaders().then(headers => {
        return fetch('/stream/without-parser', {
          method: 'POST',
          headers,
          body: JSON.stringify({ ...userData, url: `${process.env.END_POINT_URL}/api/v1/user`, method: 'POST' }),
        }).then(response => {
          Fetcher.processResponse(response);
          return response.json();
        }).then(response => {
          profile.user = response.response;
          profile.userMetadata = userMetadata;
          return profile;
        });
      });
    })
  }

  updateFireBaseToken(userId, token) {
    return this.buildHeaders().then(headers => {
      return fetch('/stream/without-parser', {
        method: 'POST',
        headers,
        body: JSON.stringify({ url: `${process.env.END_POINT_URL}/api/v1/user/${userId}/token?token=${token}&platform=2`, method: 'PUT' }),
      }).then(response => {
        Fetcher.processResponse(response);
        return response.json();
      }).then(response => {

      });
    });
  }

  /**
   * Handle response
   * @param response
   */
  static processResponse(response) {
    if (response.status >= 200 && response.status < 300) {
      return true;
    } else if (response.status === 401 || response.status === 403) { // Authenticate failed
      window.location.href = '/login';
    }
    return false;
  }

  /**
   * Get method
   * @param url
   */
  get(url) {
    return this.buildHeaders().then(headers => {
      return fetch('/stream', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          method: 'GET',
          url: `${process.env.END_POINT_URL}${url}`
        }),
      }).then(response => {
        Fetcher.processResponse(response);
        return response.json();
      });
    })
  }

  /**
   * Post method
   * @param url
   * @param data
   * @param json
   */
  post(url, data = {}, json = true) {
    return this.buildHeaders().then(headers => {
      return fetch((json) ? '/stream/without-parser' : '/stream', {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...data, url: `${process.env.END_POINT_URL}${url}`, method: 'POST' }),
      }).then(response => {
        Fetcher.processResponse(response);
        return response.json();
      });
    })
  }

  /**
   * Put method
   * @param url
   * @param data
   * @param json
   */
  put(url, data = {}, json) {
    return this.buildHeaders().then(headers => {
      return fetch((json) ? '/stream/without-parser' : '/stream', {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...data, url: `${process.env.END_POINT_URL}${url}`, method: 'PUT' }),
      }).then(response => {
        Fetcher.processResponse(response);
        return response.json();
      });
    })
  }

  Delete(url) {
    return this.buildHeaders().then(headers => {
      return fetch('/stream', {
        method: 'POST',
        headers,
        body: JSON.stringify({ url: `${process.env.END_POINT_URL}${url}`, method: 'DELETE' }),
      }).then(response => {
        Fetcher.processResponse(response);
        return response.json();
      });
    })
  }

  getCallToken(accountSId, authToken) {
    return fetch('/call-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountSId, authToken }),
    }).then(response => {
      return response.json();
    });
  }
}

export default new Fetcher();

