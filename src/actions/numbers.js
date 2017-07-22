export const load = {
  request: () => ({}),
  success: data => ({ data }),
  fail: error => ({ error })
};

export const edit = {
  request: (id, data) => ({ id, data }),
  success: data => ({ data }),
  fail: (id, error) => ({ id, error })
};

export const getStatistics = {
  request: id => ({ id }),
  success: (id, data) => ({ id, data }),
  fail: (id, error) => ({ id, error })
};

export const search = {
  request: (country, number, matchTo, capabilities) => ({
    country,
    number,
    matchTo,
    capabilities
  }),
  success: data => ({ data }),
  error: error => ({ error })
};
