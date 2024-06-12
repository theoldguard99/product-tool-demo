export const isRequired = (value) => {
  return value !== undefined && value !== null && value.trim() !== "";
};

export const isPositiveNumber = (value) => {
  return parseFloat(value) > 0;
};

export const hasNoSpecialCharacters = (value) => {
  const regex = /^[a-zA-Z0-9\s]+$/;
  return regex.test(value);
};

export const isMaxLength = (value, maxLength) => {
  return value.length <= maxLength;
};
