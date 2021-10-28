const express = require('express'),
  config = require('dotenv').config().parsed,
  mongoose = require('mongoose'),
  cors = require('cors'),
  {errorHandler} = require('./app/v1/middlewares'),
  swaggerUI = require('swagger-ui-express'),
  swaggerSchema = require('./swagger-docs/');

require('./polyfills')();
const app = express();

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
app.use(cors()); // TODO: настроить корсы
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

/**
 * log func
 */
app.use((req, res, next) => {
  console.groupCollapsed(new Date());
  console.log(`
    url: ${req.url}
    headers: ${req.rawHeaders}
    method: ${req.method}`);
  console.log('body:');
  console.log(req.body);
  console.groupEnd();
  next();
});

const BASE_API_URL = process.env.BASE_API_URL;
const VERSION = process.env.VERSION;
console.log(`${BASE_API_URL}/${VERSION}/`);
require('./app/v1/routes').forEach(routeName => {
  app.use(`${BASE_API_URL}/${VERSION}/${routeName}`,
    require(`./app/v1/routes/${routeName}.js`));
});
app.use('/swagger/', swaggerUI.serve, swaggerUI.setup(swaggerSchema));

/**
 * Error handle middleware
 */
app.use(errorHandler);

const PORT = process.env.PORT ?? config.PORT;
const MONGO_URL = process.env.MONGO_URL ?? config.MONGO_URL;

/**
 * Подключение к бд и прослушивание порта
 */
console.group('DB');
try {
  console.log('Connecting to db...');
  mongoose.connect(
    MONGO_URL,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
  );
  console.log('DB connected successfully');
} catch (err) {
  console.log(`Error while connecting to DB: ${err}`);
  process.exit(1);
} finally {
  console.groupEnd();
}

console.group('Server');
try {
  console.log('Trying to create listening');
  app.listen(PORT);

  console.log(`Server running at ${PORT}`);
} catch (err) {
  console.log(`Error while starting listening: ${err}`);
  process.exit(1);
} finally {
  console.groupEnd();
}

module.exports = app;
