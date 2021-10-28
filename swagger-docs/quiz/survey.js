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
    survey,
    group,
    subgroup,
  } = require('../components/survey'),
  {successFlag} = require('../components/general'),
  {wrapInApplicationJson, wrapIn200, wrapInParameters} = require('../helpers');

module.exports = {
  '/quiz/survey/': {
    get: {
      tags: ['Survey'],
      summary: 'Получить направления диагностического опроса',
      operationId: 'getSurvey',
      responses: {
        ...wrapIn200('Список всех направлений диагностического опроса',
          surveyArraySchema),
        ...unauthorized,
      },
    },
    post: {
      tags: ['Survey'],
      summary: 'Создать направление диагностического опроса',
      operationId: 'createSurvey',
      requestBody: {
        required: true,
        ...wrapInApplicationJson(survey),
      },
      responses: {
        ...wrapIn200('Направление добавлено', surveySchema),
        ...unauthorized,
      },
    },
  },

  '/quiz/survey/{id}': {
    get: {
      tags: ['Survey'],
      summary: 'Получить направление диагностического опроса по id',
      operationId: 'getSurveyByID',
      ...wrapInParameters([
        {
          description: 'ObjectID направления',
        },
      ]),
      responses: {
        ...wrapIn200('Направление диагностического опроса', surveySchema),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
    },
    patch: {
      tags: ['Survey'],
      summary: 'Изменить направление диагностического опроса',
      operationId: 'updateSurvey',
      ...wrapInParameters([
        {
          description: 'ObjectID направления',
        },
      ]),
      requestBody: {
        required: true,
        ...wrapInApplicationJson(survey),
      },
      responses: {
        ...wrapIn200('Направление изменено', surveySchema),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
      delete: {
        tags: ['Survey'],
        summary: 'Удалить направление диагностического опроса',
        operationId: 'deleteSurvey',
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
  '/quiz/survey/{id}/groups/': {
    get: {
      tags: ['Survey'],
      summary: 'Получить группы по ID направлению диагностического опроса',
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

  '/quiz/survey/group/{id}/': {
    get: {
      tags: ['Survey'],
      summary: 'Получить группу диагностического опроса по ID',
      operationId: 'getGroupByID',
      ...wrapInParameters([
        {
          description: 'ObjectID группы',
        },
      ]),
      responses: {
        ...wrapIn200('Группа диагностического опроса', groupSchema),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
    },
    patch: {
      tags: ['Survey'],
      summary: 'Изменить группу диагностического опроса',
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
      tags: ['Survey'],
      summary: 'Удалить группу диагностического опроса',
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

  '/quiz/survey/group/{parent_id}/subgroups/': {
    get: {
      tags: ['Survey'],
      summary: 'Получить подгруппы диагностического опроса по ID группы',
      operationId: 'getSubgroups',
      ...wrapInParameters([
        {
          id: 'parent_id',
          description: 'ObjectID группы',
        },
      ]),
      responses: {
        ...wrapIn200('Подгруппы диагностического опроса',
          subgroupArraySchema),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
    },
  },

  '/quiz/survey/subgroup/{id}/': {
    get: {
      tags: ['Survey'],
      summary: 'Получить подгруппу диагностического опроса по ID',
      operationId: 'getSubgroupByID',
      ...wrapInParameters([
        {
          description: 'ObjectID подгруппы',
        },
      ]),
      responses: {
        ...wrapIn200('Подруппа диагностического опроса',
          subgroupSchema),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
    },
    patch: {
      tags: ['Survey'],
      summary: 'Изменить подгруппу диагностического опроса',
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
      tags: ['Survey'],
      summary: 'Удалить подгруппу диагностического опроса',
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

  '/quiz/survey/{parent_id}/group/': {
    post: {
      tags: ['Survey'],
      summary: 'Создать группу в направлении диагностического опроса',
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
        ...wrapIn200('Группа даигностического опроса создана',
          groupSchema),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
    },
  },

  '/quiz/survey/group/{parent_id}/subgroup/': {
    post: {
      tags: ['Survey'],
      summary: 'Создать подгруппу в группе диагностического опроса',
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
        ...wrapIn200('Подгруппа даигностического опроса создана',
          subgroupSchema),
        ...unauthorized,
        ...idIsNotObjectId,
        ...notFound,
      },
    },
  },
};
