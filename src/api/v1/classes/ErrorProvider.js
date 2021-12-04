module.exports = class ErrorProvider extends Error {
  /**
   * @param {String} message - Сообщение об ошибке
   */
  constructor(message) {
    super(message);
    this.status = 500;
  }

  BadRequest() {
    this.status = 400;
    return this;
  }

  Unauthorized() {
    this.status = 401;
    return this;
  }

  Forbidden() {
    this.status = 403;
    return this;
  }

  NotFound() {
    this.status = 404;
    return this;
  }

  throw() {
    throw this;
  }
};
