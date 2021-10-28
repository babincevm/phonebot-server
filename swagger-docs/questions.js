const {
    idIsNotObjectId,
    unauthorized,
    notFound,
  } = require('./components/responses'),
  {
    question,
    questionSchema,
    questionsArraySchema,
  } = require('./components/questions'),
  {successFlag} = require('./components/general'),
  {wrapInApplicationJson, wrapIn200, wrapInParameters} = require('./helpers');

module.exports = {
  '/question/{id}': {
    get: {
      tags: ['Question'],
      summary: 'Получить вопрос по id',
      operationId: 'getQuestionsById',
      ...wrapInParameters([
        {
          description: 'ObjectId вопроса',
        },
      ]),
      responses: {
        ...wrapIn200('Вопрос', questionSchema),
        ...unauthorized,
        ...notFound,
        ...idIsNotObjectId,
      },
    },
    patch: {
      tags: ['Question'],
      summary: 'Изменить вопрос по id',
      operationId: 'updateQuestionsById',
      ...wrapInParameters([
        {
          description: 'ObjectId вопроса',
        },
      ]),
      requestBody: {
        required: true,
        ...wrapInApplicationJson(question),
      },
      responses: {
        ...wrapIn200('Измененный вопрос', questionSchema),
        ...unauthorized,
        ...notFound,
        ...idIsNotObjectId,
      },
    },
    delete: {
      tags: ['Question'],
      summary: 'Удалить вопрос по id',
      operationId: 'updateQuestionsById',
      ...wrapInParameters([
        {
          description: 'ObjectId вопроса',
        },
      ]),
      responses: {
        ...wrapIn200('Вопрос удален', successFlag),
        ...unauthorized,
        ...notFound,
        ...idIsNotObjectId,
      },
    },
  },

  '/question/all/': {
    get: {
      tags: ['Question'],
      summary: 'Получить все вопросы',
      operationId: 'getAllQuestions',
      responses: {
        ...wrapIn200('Список всех вопросов диагностики', questionsArraySchema),
        ...unauthorized,
      },
    },
  },

  '/question/subgroup/{subgroup_id}/': {
    get: {
      tags: ['Question'],
      summary: 'Получить направление диагностического опроса по id',
      operationId: 'getAllQuestionsInSubgroup',
      ...wrapInParameters([
        {
          name: 'subgroup_id',
          description: 'ObjectID подгруппы',
        },
      ]),
      responses: {
        ...wrapIn200('Все вопросы в подгруппе', questionsArraySchema),
        ...unauthorized,
        ...notFound,
        ...idIsNotObjectId,
      },
    },
  },

  '/question/': {
    post: {
      tags: ['Question'],
      summary: 'Получить вопрос по id',
      operationId: 'createQuestion',
      requestBody: {
        required: true,
        ...wrapInApplicationJson(question),
      },
    },
    responses: {
      ...wrapIn200('Созданный вопрос', questionSchema),
      ...unauthorized,
    },
  },
};
