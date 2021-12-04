const CRUD = require('./CRUD'),
  {ErrorProvider} = require('../classes/');

const {deepLog} = require('./../helpers/functions');


class User extends CRUD {

  async login({body: {login, password}, cache}, res, next) {
    let user = await this.model.getByLogin(login);
    if (!user) return next(new ErrorProvider('User not found').NotFound());

    await user.validatePassword(password);
    let token = await user.generateToken();
    user = user.toObject();
    let id = user._id;
    await cache.set(`access#${id}:fields`, user.account_data.role.fields);
    user.filterBy(user.account_data.role.fields.User);
    await cache.set(`user#${id}`, user);
    user.token = token;

    this.sendResult(res, user);
  }

  async getProfile({token, cache}, res) {
    console.log(`user#${token.aud}`);
    let user = await cache.get(`user#${token.aud}`);
    if (!user) {
      user = await this.model.get(token.aud);
    }
    // user = user.toObject();
    let access = await cache.get(`access#${token.aud}:fields`);
    user.filterBy(access.User);
    this.sendResult(res, user);
  }

  async register({body, cache}, res, next) {
    let user = await new this.model(body).save({timestamps: true});
    await this.model.populate(user, {
      path: 'account_data.role',
    });
    let token = await user.generateToken();
    user = user.toObject();
    await cache.set(`user#${user._id}`, user);
    user.filterBy(user.account_data.role.fields.User);
    user.token = token;
    return this.sendResult(res, user);
  }

  async removeUser({token, cache}, res, next) {
    await this.model.findByIdAndRemove(token.aud);
    await cache.del(`user#${token.aud}`, null);
    await cache.del(`access#${token.aud}:fields`, null);

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
