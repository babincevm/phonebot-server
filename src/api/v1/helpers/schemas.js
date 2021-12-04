/**
 * Удаление переданных полей из объекта ответа
 *
 * @param {String} hidden_fields Строка со скрытыми полями
 * @return {Object} Документ без скрытых полей
 */
function hideFields (hidden_fields) {
  if (!hidden_fields) return this;

  console.log(this);

  hidden_fields.split(' ').forEach(prop => {
    delete this[prop];
  });

  return this;
}

module.exports = {
  hideFields,
};
