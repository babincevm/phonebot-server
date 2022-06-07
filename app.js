const express = require('express'),
  {
    Logger,
    ErrorHandler,
    Server,
    Database,
    Environment,
    ErrorProvider,
  } = require('./src/'),
  cors = require('cors')(),
  swaggerUI = require('swagger-ui-express'),
  polyfills = require('./polyfills'),
  swaggerSchema = require('./swagger-docs/');

polyfills.init();
const app = express();

async function start() {

  // app.use(Logger.bodyLog);

  let url = Environment.API_URL;
  app.get(url, (req, res) => {
    res.status(200).json({ok: true});
  });

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  app.use(cors); // TODO: настроить корсы
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(express.static('./../admin/public/index.html'));

  require('./src/api/v1/routes').forEach(routeName => {
    app.use(
      `${url}/${routeName}`,
      require(`./src/api/v1/routes/${routeName}.js`),
    );
  });

  app.use('/static/docs/', swaggerUI.serve, swaggerUI.setup(swaggerSchema)).use(
    (
      err,
      req,
      res,
      next,
    ) => ErrorHandler.handle(err, req, res, next),
  ).use(
    (
      req,
      res,
      next,
    ) => ErrorHandler.handle(
      new ErrorProvider('Not found').NotFound(),
      req, res, next,
    ),
  );

  const server = new Server();
  const database = new Database();

  try {
    await database.connect(Environment.MONGO_URL);
    server.init(app, Environment.PORT, Environment.DOMAIN,
      Environment.PROTOCOL);

    console.clear();
  } catch (e) {
    process.exit(1);
  }
}

start().then();

module.exports = app;
