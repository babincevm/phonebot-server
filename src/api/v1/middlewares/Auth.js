const {JWT, ErrorProvider} = require('./../classes/');


class Auth {
  constructor() {}

  /**
   * Функция верификации токена из хедерса
   * Токен должен быть с ключом authorization
   * Значение токена должно быть Bearer #token#
   *
   * Возвращает 401 ошибку, если токена нет
   * Возвращает 400 ошибку, если в значении токена нет Bearer
   *
   * @param req
   * @param res
   * @param next
   * @return {Promise<*>}
   */
  async verifyToken(req, res, next) {
    let token = req.headers['authorization'];
    if (!token) {
      return next(new ErrorProvider('Unauthorized').Unauthorized());
    }
    token = token.toString();
    if (!token.includes('Bearer')) {
      return next(new ErrorProvider(
        'Request does not contain bearer authorization').BadRequest(),
      );
    }

    token = token.replace('Bearer', '').trim();

    try {
      token = JWT.verify(token);
    } catch (e) {
      return next(e);
    }

    req.token = token;
    return next();
  }
}


module.exports = new Auth();
