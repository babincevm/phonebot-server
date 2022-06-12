/**
 * @typedef {Object} handlerResult
 * @property {Number} status - Статус ответа
 * @property {String} message - Текстовое описание ошибки
 */


const {ErrorProvider} = require('../classes');
const {Error: {ValidationError, CastError, StrictModeError}} = require(
  'mongoose');
const {functions: {has}} = require('../utils');
const {JsonWebTokenError} = require('jsonwebtoken');
const {Response, Request, NextFunction} = require('express');
const {MongoError} = require('mongodb');


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
      message: 'Cast error',
    };
    console.log('err: ', err);
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
      message: 'Validation error',
    };

    let messages = [];
    for (let error in err.errors) {
      if (!has(err.errors, error)) continue;

      let cur = err.errors[error];
      if (!has(cur, 'kind')) continue;

      console.log('cur: ', cur);
      switch (cur.kind.toLowerCase()) {
        case 'required': {
          messages.push(
            cur.properties.message || `Path \`${cur.path}\` is required`);
          break;
        }
        case 'embedded': {
          messages.push(
            `${this.getHandleResult(cur.reason).message} for path ${cur.path}`,
          );
          break;
        }
        case 'user defined': {
          console.log(cur);
          if (cur.reason) {
            let reasonResult = this.getHandleResult(cur.reason);
            messages.push(reasonResult.message);
            result.status = reasonResult.status;
          } else {
            messages.push(
              cur.properties.message ||
              `Validation error for path ${cur.path}`);

          }
          break;
        }
        case 'objectid': {
          messages.push(`Invalid id format for path ${cur.path}`);
          break;
        }
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
      message: 'Database error',
    };

    switch (err.code) {
      case 11000: {
        let messages = [];
        for (let key in err.keyValue) {
          if (!has(err.keyValue, key)) continue;

          messages.push(key);
        }
        result.message = `[${messages.join(', ')}] already in use`;
        break;
      }
      case 66: {
        /**
         * TODO: Поправить этот костыль
         */
        result.message = err.message.split('::')[2].trim();
      }
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
   * Обработка неверных полей в схеме
   * @param {StrictModeError} err
   */
  handleStrictModeError(err) {
    return {
      status: 400,
      message: err.message.replace(' and strict mode is set to throw.', ''),
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
    console.group('Error handler');
    console.log(err.constructor);
    console.log('err: ', err);
    console.groupEnd();

    let handlerResult = this.getHandleResult(err);

    return res.status(handlerResult.status).
      json({ok: false, message: handlerResult.message});
  }

  getHandleResult(err) {
    if (err.name === 'MongoError') {
      return this.handleMongoError(err);
    }

    switch (err.constructor) {
      case ErrorProvider:
        return this.handleCustomError(err);
      case CastError:
        return this.handleCastError(err);
      case ValidationError:
        return this.handleValidationError(err);
      case JsonWebTokenError:
        return this.handleJsonWebTokenError(err);
      case TypeError:
        return this.handleTypeError(err);
      case StrictModeError:
        return this.handleStrictModeError(err);

      default:
        return {
          status: 500,
          message: err.message ?? 'Something went wrong :(',
        };
    }
  }
}


module.exports = new ErrorHandler();
