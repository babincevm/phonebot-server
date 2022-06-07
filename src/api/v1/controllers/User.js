const CRUD = require('./CRUD'),
  {ErrorProvider} = require('../classes/');

const {deepLog} = require('./../helpers/functions');


class User extends CRUD {

  /**
   * Логин пользователя
   * @param {String} login - логин из тела
   * @param {String} password - пароль из тела
   * @param {Response} res
   * @param {CallableFunction} next
   * @return {Promise<*>}
   */
  async login({body: {login, password}}, res, next) {
    let user = await this.model.getByLogin(login);
    if (!user) return next(new ErrorProvider('User not found').NotFound());

    if (!await user.validatePassword(password)) {
      return next(new ErrorProvider('Invalid password').BadRequest());
    }
    let token = await user.generateToken({});
    user = user.toObject();
    user.token = token;

    this.sendResult(res, user);
  }

  async getProfile({token}, res) {
    let user = await this.model.get(token.aud);
    this.sendResult(res, user);
  }

  async register({body}, res, next) {
    let user = await new this.model(body).save({timestamps: true});
    let token = await user.generateToken({});
    user = user.toObject();
    user.token = token;
    return this.sendResult(res, user);
  }

  async removeUser({token}, res, next) {
    await this.model.findByIdAndRemove(token.aud);
    this.sendResult(res);
  }

  async recoverPassword() {}

  async getPatients() {}

  async getExercises() {}

  async setExercises() {}

  async setExerciseAnswer() {}

  async removeExercise() {}

  async setDiagnosisAnswer() {}

  async getQuiz(req, res) {
    this.sendResult(res, {k: 123});
  }
}


module.exports = User;
