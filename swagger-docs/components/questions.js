const {successFlag} = require('./general');

const question = {
  type: 'object',
  description: 'Вопрос диагностики',
  properties: {
    test: {
      type: 'string',
      description: 'ДОПИСАТЬ',
    },
  },
};


module.exports = {
  questionSchema: {
    type: 'object',
    properties: {
      ...successFlag,
      result: {
        ...question,
      },
    },
  },
  questionsArraySchema: {
    type: 'object',
    properties: {
      ...successFlag,
      result: {
        type: 'array',
        description: 'Список вопросов',
        items: {
          ...question,
        },
      },
    },
  },
  question,
};
