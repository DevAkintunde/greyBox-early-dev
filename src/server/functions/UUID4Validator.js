import validator from "validator";

const UUID4Validator = (value) => {
  if (validator.isUUID(value)) return true;
  return false;
};
export { UUID4Validator };
