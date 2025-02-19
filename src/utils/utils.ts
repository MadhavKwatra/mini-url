import validator from "validator";

export function validateUrl(value: string) {
  return validator.isURL(value, {});
}
