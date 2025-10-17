export const validateEmail = (value) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(value);
};

export const validatePassword = (value) => {
  return typeof value === 'string' && value.length >= 6;
};