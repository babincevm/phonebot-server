const {Environment} = require('./../src/');
const HOST = Environment.DOMAIN;
const PROTOCOL = Environment.PROTOCOL;
const BASE_API_URL = Environment.BASE_API_URL;
const VERSION = Environment.API_VERSION;

module.exports = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'PhoneBot',
    description: 'PhoneBot project api documentation',
    termsOfService: '',
  },
  servers: [
    {
      url: `${PROTOCOL}://${HOST}${BASE_API_URL}/${VERSION}`,
      description: 'Local server',
    },
  ],
  components: {
    schemas: {},
    securitySchemes: {
      bearerAuth: {
        type: 'apiKey',
        name: 'api_key',
        in: 'header',
      },
    },
  },
  tags: [
    {
      name: 'Survey',
      description: 'Диагностический опрос'
    },
    {
      name: 'Test',
      description: 'Диагностический тест'
    },
    {
      name: 'Question',
      description: 'Вопросы диагностического теста/опроса'
    },
    {
      name: 'Patient',
      description: 'Пользователь'
    },
    {
      name: 'Doctor',
      description: 'Врач'
    },
    {
      name: 'Card',
      description: 'Карта пацента'
    },
    {
      name: 'Exercise',
      description: 'Упражнения'
    },
  ],
  paths: {
    ...require('./quiz/survey'),
    ...require('./quiz/tests'),
    ...require('./questions'),
    ...require('./users/patient'),
    ...require('./users/doctor'),
    ...require('./card'),
    ...require('./exercises'),

  }
};
