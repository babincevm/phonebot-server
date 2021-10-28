/**
 * Функция оборачивает переданную схему в application/json
 * Используется в JSON-body
 *
 * @param {Object} schema - Схема, которую нужно обернуть в application/json
 * @return {{content: {'application/json': {schema}}}}
 */
const wrapInApplicationJson = (schema) => ({
  content: {
    'application/json': {
      schema: {
        ...schema,
      },
    },
  },
});

/**
 * Функция оборачивает переданную схему в 200 статус ответа
 * Используется в респонсвх
 *
 * @param {String} description - Текстовое описание
 * @param {Object} schema - схема
 * @return {{'200': {description, content: {'application/json': {schema}}}}}
 */
const wrapIn200 = (description, schema) => ({
  '200': {
    description: description,
    ...wrapInApplicationJson(schema),
  },
});

/**
 * @typedef {Object} Parameters
 * @property {String} in="path" - в каком месте этот парамс
 * @property {String} name="id" - название парамса
 * @property {Boolean} required=true - обязательный ли параметр
 * @property {String} description - описание параметра
 *
 * Функция оборачивает переданные парамсы для свагера
 * Используется как параметры
 *
 * @param {Array<Parameters>} parameters - массив объектов параметров
 * @return {{parameters}}
 */
const wrapInParameters = (parameters) => ({
  parameters: parameters.reduce((acc, param) => {
    acc.push({
      in: param.in ?? 'path',
      name: param.name ?? 'id',
      required: param.required ?? true,
      description: param.description,
    });
    return acc;
  }, []),
});

module.exports = {
  wrapIn200,
  wrapInApplicationJson,
  wrapInParameters,
};
