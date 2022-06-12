const mongoose = require('mongoose');


/**
 * Проверка ID на существование в БД
 * @param {String|mongoose.Types.ObjectId} id ID для проверки
 * @param {String} modelName название модели, в которой будет проверяться существование
 * @return {Promise<boolean>} ID существует в БД
 */
async function isIdExists(id, modelName) {
  return await mongoose.model(modelName).exists(id);
}

/**
 * @typedef {Object} isIdsArrayExists
 * @property {Boolean} ok Все id существуют в БД
 * @property {([String|mongoose.Types.ObjectId]|null)} notExists Не существующие ID
 *
 * Проверка массива id на существование в БД
 *
 * @param {[String|mongoose.Types.ObjectId]} ids массив id для проверки
 * @param {String} modelName название модели, в которой будет проверяться существование
 * @return {isIdsArrayExists}
 */
async function isIdsArrayExists(ids, modelName) {
  return await ids.reduce(async (accP, id) => {
    let acc = await accP;
    if (!await isIdExists(id, modelName)) {
      acc.ok = false;
      acc.notExists.push(id);
    }
    return acc;
  }, {ok: true, notExists: []});
}

module.exports = {
  isIdExists,
  isIdsArrayExists,
};
