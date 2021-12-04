const {expect} = require('chai');


class Validate {
  /**
   * Валидация статуса
   * @param {Number} status - Статус ответа
   * @param {Number} eql - Ожидаемый статус
   * @param {String} msg - Сообщение об ошибке
   */
  status(status, eql, msg = null) {
    expect(status, 'Status is not a number').to.be.a('number');
    expect(status, 'Status is less than 200').to.be.above(199);
    expect(status, 'Status is greater than 500').to.be.below(501);
    expect(status, msg ?? `Status is not ${eql}`).to.be.equal(eql);
  }

  /**
   * Валидация типа тела ответа
   * @param {Object} data - Тело ответа
   */
  dataType(data) {
    expect(data, 'Data is null').to.not.be.null;
    expect(data, 'Data is undefined').to.not.be.undefined;
    expect(data, 'Data is not an object').to.be.an('object');
  }

  /**
   * Валидация корректного ответа
   * @param {Number} status - Статус ответа
   * @param {Object} data - Тело ответа
   */
  correct(status, data) {
    this.status(status, 200, data?.message);
    this.dataType(data);
    expect(data.ok, data?.message).to.be.equal(true);
  }

  /**
   * Валидация некорректного ответа
   * @param {Object} data - Тело ответа
   */
  incorrect(data) {
    this.dataType(data);
    expect(data.ok, 'Ok flag is not false').to.be.equal(false);
  }

  /**
   * Валидация сообщения об ошибке
   * @param {Object} data - Тело ответа
   * @param {String} value - Ожидаемая подстрока в сообщении
   */
  message(data, value = null) {
    expect(data, 'Data has no error message').to.have.own.property('message');
    expect(data.message, 'Message is not a string').to.be.a('string');
    if (value !== null) {
      expect(data.message, 'Message is unexpected').to.include(value);
    }
  }

  /**
   * Валидация наличия токена в ответе
   * @param {Object} data - Тело ответа
   */
  token(data) {
    expect(data.result, 'Data has no token').to.have.own.property('token');
    expect(data.result.token, 'Token is not s string').to.be.a('string');
  }

  unauthorized(status, data) {
    this.status(status, 401);
    this.incorrect(data);
    this.message(data, 'Unauthorized');
  }
}


module.exports = Validate;
