import uuid from "uuid/v4";

export const add = (type, message, path = "global", duration) => ({
  id: uuid(),
  path,
  type,
  message,
  duration
});

export const remove = (path, id) => ({ path, id });
