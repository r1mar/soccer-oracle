import Error from "./Error";

export default class FieldError extends Error {
  constructor(field, ...params) {
    super(...params);

    this.field = field;
  }
}
