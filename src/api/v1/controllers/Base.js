const {Response} = require('express');
const mongoose = require('mongoose');
const {CustomError} = require('../classes');


class Base {
  /**
   * @param { mongoose.Model } model объект монгусовской модели текущей сущности
   */
  constructor({model}) {
    this._model = model;
  }

  /**
   * @return {mongoose.Model}
   */
  get model() {
    return this._model;
  }

  /**
   * @return {String} название текущей модели
   */
  get model_name() {
    return this._model.modelName;
  }

  /**
   * Отправка ответа на клиент
   *
   * @param {Response} res объект express.Response
   * @param {Number} status статус ответа
   * @param {{}|null} data объект, который будет отправлен
   */
  sendJSONResponse(res, status, data) {
    return res.status(status).json(data);
  }

  /**
   * @typedef {Object} Data
   * @property {Boolean} ok Флаг успех/неудача
   *
   * Генерация объекта data для отправки на клиент
   * @return {Data}
   */
  getDataObject() {
    return {
      ok: true,
    };
  }

  /**
   * Заполнение тела ответа и отправка его на клиент
   *
   * @param {Response} res Объект response
   * @param {*} result Тело ответа
   * @param {Request} req Объект request
   */
  sendResult(res, result = null, req = null) {
    let data = this.getDataObject();
    if (result) {
      data.result = this.convert(result);
    }
    this.sendJSONResponse(res, 200, data);
  }

  convert(data = {}) {
    return data.toObject ? data.toObject() : data;
  }
}


module.exports = Base;
