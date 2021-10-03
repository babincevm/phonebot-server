module.exports = {
  notFound: {
    404: {
      description: 'Элемент с таким id не найден',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              ok: {
                type: 'boolean',
                description: 'Флаг успешно/ошибка',
                example: false,
              },
              message: {
                type: 'string',
                description: 'Сообщение об ошибке',
              },
            },
          },
        },
      },
    },
  },
  idIsNotObjectId: {
    400: {
      description: 'id не является ObjectId',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              ok: {
                type: 'boolean',
                description: 'Флаг успешно/ошибка',
                example: false,
              },
              message: {
                type: 'string',
                description: 'Сообщение об ошибке',
              },
            },
          },
        },
      },
    },
  },
  unauthorized: {
    401: {
      description: 'JWT неверен или отсутствует',
    },
  },
};
