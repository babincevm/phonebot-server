const express = require('express');
const config = require('dotenv').config().parsed;
const mongoose = require('mongoose');
const cors = require('cors');
const {errorHandler} = require('./app/v1/middlewares');
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
// app.use((req, res, next) => {
console.groupCollapsed(new Date());
console.log(`
    url: ${22222}
    method: ${3333}`);
console.log('body:');
console.log(111111);
console.groupEnd();
// next();
// });

/**
 * роуты
 */
// require('./app/v1.0.0/routes').forEach(routeName => {
// 	app.use(`/api/v1.0.0/${routeName}`,
// require(`./app/v1.0.0/routes/${routeName}.route`)); });

require('./app/v1/routes').forEach(routeName => {
  app.use(`/api/v1/${routeName}`,
    require(`./app/v1/routes/${routeName}.js`));
});

/**
 * Error handle middleware
 */
app.use(errorHandler);

// app.get('/parser/', async (req, res) => {
//     await parse();
//     res.json({ok: true}).status(200).send();
// });

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
