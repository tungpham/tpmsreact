export const load = {
  request: id => ({ id }),
  success: (id, data) => ({ id, data }),
  fail: (id, error) => ({ error })
};
