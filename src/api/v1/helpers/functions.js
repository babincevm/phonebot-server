const util = require('util');


class Functions {

  /**
   * Проверка, есть ли в объекте (не в прототипах) свойство
   * @param {Object} object - Объект
   * @param {String} property - Свойство
   * @return {boolean} - Свойства принадлежит объекту
   */
  has(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }

  /**
   * Получение рандомной строки
   * @param {Number} length=8 длина строки
   * @return {string} строка из рандомных символов
   */
  getRandomString(length = 8) {
    return Math.random().toString(36).slice(-length);
  }

  deepLog(obj, name) {
    let inspect = util.inspect(obj,
      {showHidden: true, colors: true, depth: null});
    if (name) {
      console.log(name, ': ', inspect);
    } else {
      console.log(inspect);
    }
  }
}


module.exports = new Functions();
