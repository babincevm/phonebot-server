/**
 * @typedef {Object} handlerResult
 * @property {Number} status - Статус ответа
 * @property {String} message - Текстовое описание ошибки
 */


const {ErrorProvider} = require('../classes');
const {Error: {ValidationError, CastError}} = require('mongoose');
const {functions: {has}} = require('../helpers');
const {JsonWebTokenError} = require('jsonwebtoken');
const {Response, Request, NextFunction} = require('express');


class ErrorHandler {
  /**
   * Обработка CustomError
   * @param {ErrorProvider} err - Объект ошибки
   * @return {handlerResult}
   */
  handleCustomError(err) {
    return {
      status: err.status,
      message: err.message,
    };
  }

  /**
   * Обработка CastError
   * @param {CastError} err - Объект ошибки
   * @return {handlerResult}
   */
  handleCastError(err) {
    let result = {
      status: 400,
      message: '',
    };
    if (err.kind === 'ObjectId') {
      result.message = 'Invalid id';
    }
    return result;
  }

  /**
   * Обработка ValidationError
   * @param {ValidationError} err - Объект ошибки
   * @return {handlerResult}
   */
  handleValidationError(err) {
    let result = {
      status: 400,
      message: '',
    };
    let messages = [];
    for (let error in err.errors) {
      if (!has(err.errors, error)) continue;
      let cur = err.errors[error];
      if (cur.kind === 'required') {
        messages.push(
          cur.properties.message ?? `Path \`${cur.path}\` is required`);
      }
    }
    result.message = messages.join('\n');
    return result;
  }

  /**
   * Обработка MongoError
   * @param {*} err - Объект ошибки
   * @return {handlerResult}
   */
  handleMongoError(err) {
    let result = {
      status: 400,
      message: '',
    };

    if (err.code === 11000) {
      let messages = [];
      for (let key in err.keyValue) {
        if (!has(err.keyValue, key)) continue;

        messages.push(key);
      }
      result.message = `[${messages.join(', ')}] already in use`;
    }

    return result;
  }

  /**
   * Обработка JsonWebTokenError
   * @param {JsonWebTokenError} err - Объект ошибки
   * @return {handlerResult}
   */
  handleJsonWebTokenError(err) {
    return {
      status: 401,
      message: 'Unauthorized',
    };
  }

  /**
   * Обработка TypeError
   * @param {TypeError} err - Объект ошибки
   * @return {handlerResult}
   */
  handleTypeError(err) {
    return {
      status: 500,
      message: 'Something went wrong :(',
    };
  }

  /**
   * Обработка ошибок
   * @param {Error} err - Error object
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {*}
   */
  handle(err, req, res, next) {
    let handlerResult = {
      status: 500,
      message: err.message ?? 'Something went wrong :(',
    };

    // console.group('Error handler');
    // console.log(err);
    // console.groupEnd();

    if (err instanceof ErrorProvider) {
      handlerResult = this.handleCustomError(err);
    } else if (err instanceof CastError) {
      handlerResult = this.handleCastError(err);
    } else if (err instanceof ValidationError) {
      handlerResult = this.handleValidationError(err);
    } else if (err instanceof JsonWebTokenError) {
      handlerResult = this.handleJsonWebTokenError(err);
    } else if (err instanceof TypeError) {
      handlerResult = this.handleTypeError(err);
    }// TODO: найти класс MongoError и сравнивать по инстансу
    else if (err.name === 'MongoError') {
      handlerResult = this.handleMongoError(err);
    }

    return res.status(handlerResult.status).
      json({ok: false, message: handlerResult.message});
  }

}


module.exports = new ErrorHandler();
