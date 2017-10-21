let config = {};
if (process.env.NODE_ENV === 'development') {
  config = {
    domain: 'morephone.auth0.com',
    clientID: 'OftRQ9z1V9UKC16pEoBs7istyUdYBMcn',
    redirectUri: 'http://localhost:3300/callback/oauth',
    responseType: 'token id_token',
    scope: 'openid profile email user_metadata app_metadata picture'
  };
} else {
  // Prod here
  config = {
    domain: process.env.domain,
    clientID: process.env.clientID,
    redirectUri: process.env.redirectUri,
    audience: process.env.audience,
    responseType: 'token id_token',
    scope: 'openid profile email phone'
  }
}

export default config;