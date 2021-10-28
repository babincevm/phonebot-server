const PORT = process.env.PORT;
const HOST = process.env.HOST;
const PROTOCOL = process.env.PROTOCOL;
const BASE_API_URL = process.env.BASE_API_URL;
const VERSION = process.env.VERSION;

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
      url: `${PROTOCOL}://${HOST}:${PORT}${BASE_API_URL}/${VERSION}`,
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
