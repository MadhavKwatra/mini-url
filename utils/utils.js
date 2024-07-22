import validator from "validator";

export function validateUrl(value) {
  return validator.isURL(value, {});
}
