const mongoose = require('mongoose');


class Database {
  constructor() {}

  /**
   * Подключение к mongoDB
   *
   * @param {String} url - url подключения к БД
   * @return {Promise<*>}
   */
  connect(url) {
    return new Promise(((resolve, reject) => {
      console.group('DB');
      console.log('Connecting to db...');
      mongoose.connect(
        url,
        {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useCreateIndex: true,
          useFindAndModify: false,
        },
        (err) => {
          if (err) {
            console.log(`Error while connecting to DB: ${err}`);
            console.groupEnd();
            return reject(err);
          }

          console.log('DB connected successfully');
          console.groupEnd();
          return resolve();
        });
    }));

  }
}


module.exports = Database;
