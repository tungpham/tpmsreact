export const signIn = {
  request: (provider, options) => ({ provider, options }),
  success: (token, data) => ({ token, data }),
  fail: error => ({ error })
};

export const userData = {
  set: (token, data) => ({ token, data })
};

export const signUp = {
  request: (provider, options) => ({ provider, options }),
  success: (token, data) => ({ token, data }),
  fail: error => ({ error })
};

export const signOut = {
  request: () => ({})
};

export const edit = {
  request: user => ({ user }),
  success: user => ({ user }),
  fail: error => ({ error })
};
