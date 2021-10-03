const {
    idIsNotObjectId,
    unauthorized,
    notFound,
  } = require('../components/responses'),
  {
    surveySchema,
    subgroupArraySchema,
    subgroupSchema,
    surveyArraySchema,
    groupArraySchema,
    groupSchema,
    test,
    group,
    subgroup,
  } = require('../components/tests'),
  {successFlag} = require('../components/general'),
  {wrapInApplicationJson, wrapIn200, wrapInParameters} = require('../helpers');

module.exports = {
  '/quiz/test/': {
    get: {
      tags: ['Test'],
      summary: 'Получить направления диагностического теста',
      operationId: 'getTest',
      responses: {
        ...wrapIn200('Список всех направлений диагностического теста',
          surveyArraySchema),
        ...unauthorized,
      },
    },
    post: {
      tags: ['Test'],
      summary: 'Создать направление диагностического теста',
      operationId: 'createTest',
      requestBody: {
        required: true,
        ...wrapInApplicationJson(test),
      },
      responses: {
        ...wrapIn200('Направление добавлено', surveySchema),
        ...unauthorized,
      },
    },
  },

  '/quiz/test/{id}': {
    get: {
      tags: ['Test'],
      summary: 'Получить направление диагностического теста по id',
      operationId: 'getTestByID',
      ...wrapInParameters([
        {
          description: 'ObjectID направления',
        },
      ]),
      responses: {
        ...wrapIn200('Направление диагностического теста', surveySchema),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
    },
    patch: {
      tags: ['Test'],
      summary: 'Изменить направление диагностического теста',
      operationId: 'updateTest',
      ...wrapInParameters([
        {
          description: 'ObjectID направления',
        },
      ]),
      requestBody: {
        required: true,
        ...wrapInApplicationJson(test),
      },
      responses: {
        ...wrapIn200('Направление изменено', surveySchema),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
      delete: {
        tags: ['Test'],
        summary: 'Удалить направление диагностического теста',
        operationId: 'deleteTest',
        ...wrapInParameters([
          {
            description: 'ObjectID направления',
          },
        ]),
        responses: {
          ...wrapIn200('Направление удалено', successFlag),
          ...unauthorized,
          ...idIsNotObjectId,
          ...notFound,
        },
      },
    },
  },
  '/quiz/test/{id}/groups/': {
    get: {
      tags: ['Test'],
      summary: 'Получить группы по ID направлению диагностического теста',
      operationId: 'getGroups',
      ...wrapInParameters([
        {
          description: 'ObjectID направления',
        },
      ]),
      responses: {
        ...wrapIn200('Список групп направления', groupArraySchema),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
    },
  },

  '/quiz/test/group/{id}/': {
    get: {
      tags: ['Test'],
      summary: 'Получить группу диагностического теста по ID',
      operationId: 'getGroupByID',
      ...wrapInParameters([
        {
          description: 'ObjectID группы',
        },
      ]),
      responses: {
        ...wrapIn200('Группа диагностического теста', groupSchema),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
    },
    patch: {
      tags: ['Test'],
      summary: 'Изменить группу диагностического теста',
      operationId: 'updateGroup',
      ...wrapInParameters([
        {
          description: 'ObjectID группы',
        },
      ]),
      requestBody: {
        required: true,
        ...wrapInApplicationJson(group),
      },
      responses: {
        ...wrapIn200('Группа изменена', groupSchema),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
    },
    delete: {
      tags: ['Test'],
      summary: 'Удалить группу диагностического теста',
      operationId: 'deleteGroup',
      ...wrapInParameters([
        {
          description: 'ObjectID группы',
        },
      ]),
      responses: {
        ...wrapIn200('Группа удалена', successFlag),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
    },
  },

  '/quiz/test/group/{parent_id}/subgroups/': {
    get: {
      tags: ['Test'],
      summary: 'Получить подгруппы диагностического теста по ID группы',
      operationId: 'getSubgroups',
      ...wrapInParameters([
        {
          id: 'parent_id',
          description: 'ObjectID группы',
        },
      ]),
      responses: {
        ...wrapIn200('Подгруппы диагностического теста',
          subgroupArraySchema),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
    },
  },

  '/quiz/test/subgroup/{id}/': {
    get: {
      tags: ['Test'],
      summary: 'Получить подгруппу диагностического теста по ID',
      operationId: 'getSubgroupByID',
      ...wrapInParameters([
        {
          description: 'ObjectID подгруппы',
        },
      ]),
      responses: {
        ...wrapIn200('Подруппа диагностического теста',
          subgroupSchema),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
    },
    patch: {
      tags: ['Test'],
      summary: 'Изменить подгруппу диагностического теста',
      operationId: 'updateSubgroup',
      ...wrapInParameters([
        {
          description: 'ObjectID подгруппы',
        },
      ]),
      requestBody: {
        required: true,
        ...wrapInApplicationJson(subgroup),
      },
      responses: {
        ...wrapIn200('Подруппа изменена', subgroupSchema),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
    },
    delete: {
      tags: ['Test'],
      summary: 'Удалить подгруппу диагностического теста',
      operationId: 'deleteSubgroup',
      ...wrapInParameters([
        {
          description: 'ObjectID подгруппы',
        },
      ]),
      responses: {
        ...wrapIn200('Подгруппа удалена', successFlag),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
    },
  },

  '/quiz/test/{parent_id}/group/': {
    post: {
      tags: ['Test'],
      summary: 'Создать группу в направлении диагностического теста',
      operationId: 'createGroup',
      ...wrapInParameters([
        {
          id: 'parent_id',
          description: 'ObjectID направления',
        },
      ]),
      requestBody: {
        required: true,
        ...wrapInApplicationJson(group),
      },
      responses: {
        ...wrapIn200('Группа даигностического теста создана',
          groupSchema),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
    },
  },

  '/quiz/test/group/{parent_id}/subgroup/': {
    post: {
      tags: ['Test'],
      summary: 'Создать подгруппу в группе диагностического теста',
      operationId: 'createSubgroup',
      ...wrapInParameters([
        {
          id: 'parent_id',
          description: 'ObjectID группы',
        },
      ]),
      requestBody: {
        required: true,
        ...wrapInApplicationJson(subgroup),
      },
      responses: {
        ...wrapIn200('Подгруппа даигностического теста создана',
          subgroupSchema),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
    },
  },
};
