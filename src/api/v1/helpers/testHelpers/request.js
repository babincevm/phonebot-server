const axios = require('axios');
// const app = require('./../../../../../app');

class Request {
  /**
   * @param {String} url=null - URL сущности
   */
  constructor({url = null}) {
    if (url !== null) {
      this.setURL(url);
    }

    // console.log('app: ', app);
  }

  /**
   * устанавливает URL сущности для инстанса axios
   * @param {String} url=null - URL сущности
   */
  setURL(url = null) {
    if (url === null) return;

    this.axiosSetup(url);
  }

  loadConfig() {
    require('dotenv').config().parsed;
    this.DOMAIN = process.env.DOMAIN;
    this.PROTOCOL = process.env.PROTOCOL;
    this.BASE_API_URL = process.env.BASE_API_URL;
    this.API_VERSION = process.env.API_VERSION;
  }

  /**
   * Инициализация и настройка инстанса axios
   * @param {String} url="/" - URL сущности
   */
  axiosSetup(url = '/') {
    this.loadConfig();
    let baseURL = `${this.PROTOCOL}://${this.DOMAIN}${this.BASE_API_URL}/${this.API_VERSION}${url}`;
    this.axios = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axios.interceptors.response.use(response => response,
      function({response: {status, data}}) {
        return Promise.reject({
          status,
          data,
        });
      });
  }

  /**
   * POST запрос
   * @param {String} url="/" - URL запроса
   * @param {Object} data={} - тело запроса
   * @param {Object} headers={} - хедерсы
   * @return {Promise<Object>}
   */
  async post({url = '/', data = {}, headers = {}}) {
    return await this.request(url, 'post', {
      headers,
      data,
    });
  }

  /**
   * GET запрос
   * @param {String} url="/" - URL запроса
   * @param {Object} headers={} - хедерсы
   * @return {Promise<Object>}
   */
  async get({url = '/', headers = {}}) {
    return await this.request(url, 'get', {
      headers,
    });
  }

  /**
   * DELETE запрос
   * @param {String} url="/" - URL запроса
   * @param {Object} headers={} - хедерсы
   * @return {Promise<Object>}
   */
  async delete({url = '/', headers = {}}) {
    return await this.request(url, 'delete', {
      headers,
    });
  }

  /**
   * PATCH запрос
   * @param {String} url="/" - URL запроса
   * @param {Object} data={} - тело запроса
   * @param {Object} headers={} - хедерсы
   * @return {Promise<Object>}
   */
  async patch({url = '/', data = {}, headers = {}}) {
    return await this.request(url, 'patch', {
      headers,
      data,
    });
  }

  /**
   * Осуществляет запрос
   * @param {String} url="/" - URL запроса
   * @param {String} method="get" - метод
   * @param {Object} params={} - доп параматеры
   * @return {Promise<Object>} - Ответ сервера
   */
  async request(url = '/', method = 'get', params = {}) {
    if (!this.axios) {
      throw new Error('Entity URL is not set');
    }
    let response;
    try {
      response = await this.axios.request({
        method,
        url,
        ...params,
      });
    } catch (err) {
      response = err;
    }
    return response;
  }
}


module.exports = Request;
