export default class Error {
  constructor(message, fileName, lineNumber) {
    this.message = message;
    this.fileName = fileName;
    this.lineNumber = lineNumber;
  }
}
