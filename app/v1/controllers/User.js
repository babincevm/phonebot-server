const CRUD = require('./CRUD');

class User extends CRUD {
  async auth({body}, response) {
    console.log(body);
    this.sendResult(response, {success: true});
  }

  async getProfile(req, res) {
    /**
     * @TODO: сделать контроллер получения профиля по апи ключу из хедерса
     * @type {{birthdate: Date, name: string, age: number}}
     */
    let body = {
      name: 'Test name',
      username: 'Test username',
      email: 'test@email.com',
      phone: '89222222222',
      age: 23,
      birthdate: new Date(),
    };

    this.sendResult(res, body);
  }

  async register() {}
  async recoverPassword() {}
  async getPatients() {}
  async getExercises() {}
  async setExercises() {}
  async setExerciseAnswer() {}
  async removeExercise() {}
  async setDiagnosisAnswer() {}
}
module.exports = User;
