const mongoose = require('mongoose');

/**
 * Валидация ObjectId
 * @param {(String|mongoose.Types.ObjectId)} id id для проверки
 * @returns {boolean} Является ли переданный id валидным ObjectId
 */
function isIdValid (id) {
  return mongoose.isValidObjectId(id);
}

/**
 * Валидация массива ObjectId
 * @param {[String|mongoose.Types.ObjectId]} ids Массив id для валидации
 * @returns {{ok:{Boolean}, invalidIds:[String|mongoose.Types.ObjectId]}} ok - все id валидны, names - массив невалдных id
 */
function isIdsArrayValid (ids) {
  return ids.reduce((acc, id) => {
    if (!isIdValid(id)) {
      acc.ok = false;
      acc.invalidIds.push(id);
    }
    return acc;
  }, {
    ok: true,
    invalidIds: [],
  });
}

module.exports = {
  isIdValid,
  isIdsArrayValid,
};
