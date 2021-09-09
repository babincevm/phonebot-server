function selectFor (schema) {
  /**
   * @TODO: сделать приколы на викмапах/кеше
   * Query helper для каждой схемы на выборку полей из файла настроек
   * @param {String} user_type тип текущего пользователя
   * @param {String} extra_fields дополнительные параметры
   * @return {*}
   */
  schema.query.selectFor = function (user_type, extra_fields = '') {
    const fields = require('./../settings').hidden_fields;
    let hidden = `${fields.default_hidden} ${fields[this.model.modelName]?.[user_type]} ${extra_fields}`;

    return this.select(`${hidden}`);
  };
}

module.exports = {
  selectFor,
};
