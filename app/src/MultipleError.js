import Error from "./Error";

export default class MultipleError extends Error {
  errors = [];

  constructor(...params) {
    super(...params);
  }
}
