const config = require('dotenv').config().parsed;

class Environment {
  constructor() {
  }

  get PORT() {
    return process.env.PORT;
  }

  get PROTOCOL() {
    return process.env.PROTOCOL;
  }

  get DOMAIN() {
    return process.env.DOMAIN;
  }

  get BASE_API_URL() {
    return process.env.BASE_API_URL;
  }

  get API_VERSION() {
    return process.env.API_VERSION;
  }

  get URL() {
    return `${this.PROTOCOL}://${this.DOMAIN}:${this.PORT}/`;
  }

  get API_URL() {
    return `${this.BASE_API_URL}/${this.API_VERSION}`;
  }

  get FULL_API_URL() {
    return `${this.PROTOCOL}://${this.DOMAIN}:${this.PORT}/${this.API_URL}`;
  }

  get SITE_URL() {
    return `${this.PROTOCOL}://${this.DOMAIN}`;
  }

  get MONGO_URL() {
    return process.env.MONGO_URL;
  }

  get ACCESS_TOKEN_SECRET() {
    return process.env.ACCESS_TOKEN_SECRET;
  }
}


module.exports = new Environment();
