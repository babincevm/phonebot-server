/**
 * @module errors
 * @exports CustomError
 * @class CustomError
 * @type {CustomError}
 */
module.exports = class CustomError extends Error {
  /**
   * @constructor
   * @param message
   * @param status
   */
  constructor({message, status}) {
    super(message);
    this.status = status;
  }
};
