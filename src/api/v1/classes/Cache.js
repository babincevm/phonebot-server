const redis = require('redis');


class Cache {
  constructor() {
    this.redis = null;
  }

  use(req, res, next) {
    req.cache = this;
    return next();
  }

  /**
   * Подключение к редису
   * @param {Number} port - Порт для редиса
   * @throws Error Если для клиента уже есть редис
   * @return {Promise<*>}
   */
  init(port = null) {
    if (this.redis !== null) {
      throw new Error('Redis already connected');
    }
    return new Promise(((resolve, reject) => {
      console.group('Redis');
      console.log('Connecting to redis');
      this.redis = redis.createClient(port);

      this.redis.on('error', function(error) {
        console.error('Redis init error: ', error);
        console.groupEnd();
        return reject(error);
      });

      this.redis.on('connect', function() {
        console.log('Redis connected successfully');
        console.groupEnd();
        return resolve();
      });
    }));
  }

  get(key) {
    return new Promise(((resolve, reject) => {
      this.redis.get(key, (err, value) => err ? reject(err) : resolve(value));
    }));
  }

  set(key, value) {
    return new Promise(((resolve, reject) => {
      if (!String.prototype.isString(value)) {
        value = JSON.stringify(value);
      }
      this.redis.set(key, value, (err) => err ? reject(err) : resolve());
    }));
  }

  del(key) {
    return new Promise(((resolve, reject) => {
      this.redis.del(key, (err) => err ? reject(err) : resolve());
    }));
  }
}


module.exports = new Cache();
