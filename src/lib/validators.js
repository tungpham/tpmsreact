export const required = value =>
  (value ? value.trim().length > 0 ? undefined : "Required" : "Required");

export const email = value =>
  (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? "Invalid email address"
    : undefined);

export const length = length => value =>
  (value && value.trim().length !== length
    ? "Invalid length (" + length + ")"
    : undefined);
