const express = require('express'),
  {
    Logger,
    ErrorHandler,
    Server,
    Database,
    Environment,
    Cache,
  } = require('./src/'),
  cors = require('cors')(),
  swaggerUI = require('swagger-ui-express'),
  polyfills = require('./polyfills'),
  swaggerSchema = require('./swagger-docs/');

polyfills.init();
const app = express();

// app.use(Logger.bodyLog);

async function start() {

  await Cache.init();

  app.use((...props) => Cache.use(...props));
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  app.use(cors); // TODO: настроить корсы
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  // app.use(express.static('public'));

  let url = Environment.API_URL;
  require('./src/api/v1/routes').forEach(routeName => {
    app.use(
      `${url}/${routeName}`,
      require(`./src/api/v1/routes/${routeName}.js`),
    );
  });
  app.use('/swagger/', swaggerUI.serve, swaggerUI.setup(swaggerSchema));

  app.use(
    (
      err,
      req,
      res,
      next,
    ) => ErrorHandler.handle(err, req, res, next),
  );

  const server = new Server();
  const database = new Database();

  try {
    await database.connect(Environment.MONGO_URL);
    server.init(app, Environment.PORT);
  } catch (e) {
    process.exit(1);
  }
}

start().then();

module.exports = app;
