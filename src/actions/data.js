export const entities = {
  add: entities => ({
    data: {
      normalized: entities
    }
  }),

  remove: data => ({
    data
  })
};

export const request = (type, reset) => ({
  type,
  reset
});

export const success = (type, raw, normalized) => ({
  type,
  data: {
    raw,
    normalized
  },
  add: true
});

export const fail = (type, error) => ({
  type,
  error
});
