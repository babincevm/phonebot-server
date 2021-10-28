const {successFlag} = require('./general');

const survey = {
  type: 'object',
  description: 'Направление',
  properties: {
    test: {
      type: 'string',
      description: 'ДОПИСАТЬ',
    },
  },
};
const group = {
  type: 'object',
  description: 'Группа',
  properties: {
    test: {
      type: 'string',
      description: 'ДОПИСАТЬ',
    },
  },
};
const subgroup = {
  type: 'object',
  description: 'Подгруппа',
  properties: {
    test: {
      type: 'string',
      description: 'ДОПИСАТЬ',
    },
  },
};

/**
 * Схемы опросов/групп/подгрупп опросов и диагностик и их объекты
 */
module.exports = {
  surveySchema: {
    type: 'object',
    properties: {
      ...successFlag,
      result: {
        ...survey,
      },
    },
  },
  groupSchema: {
    type: 'object',
    properties: {
      ...successFlag,
      result: {
        ...group,
      },
    },
  },
  subgroupSchema: {
    type: 'object',
    properties: {
      ...successFlag,
      result: {
        ...subgroup,
      },
    },
  },

  surveyArraySchema: {
    type: 'object',
    properties: {
      ...successFlag,
      result: {
        type: 'array',
        description: 'Список направлений',
        items: {
          ...survey,
        },
      },
    },
  },
  groupArraySchema: {
    type: 'object',
    properties: {
      ...successFlag,
      result: {
        type: 'array',
        description: 'Список групп',
        items: {
          ...group,
        },
      },
    },
  },
  subgroupArraySchema: {
    type: 'object',
    properties: {
      ...successFlag,
      result: {
        type: 'array',
        description: 'Список подгрупп',
        items: {
          ...subgroup,
        },
      },
    },
  },

  survey,
  group,
  subgroup,

};
