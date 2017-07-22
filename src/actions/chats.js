export const load = {
  request: id => ({ id }),
  success: (id, data) => ({ id, data }),
  fail: (id, error) => ({ error })
};

export const messages = {
  load: {
    request: (from, to) => ({ from, to }),
    success: (from, to, data) => ({ from, to, data }),
    fail: (from, to, error) => ({ from, to, error })
  },

  send: {
    request: (from, to, message) => ({ from, to, message }),
    success: (from, to) => ({ from, to }),
    fail: (from, to, error) => ({ from, to, error })
  }
};

export const conversation = {
  send: {
    request: (from, toNumber, message) => ({ from, toNumber, message }),
    success: (from, to) => ({ from, to }),
    fail: (from, toNumber, error) => ({ from, toNumber, error })
  }
};
