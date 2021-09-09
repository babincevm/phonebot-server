const CRUD = require('./CRUD');

class User extends CRUD {
  async auth({body}, response) {
    console.log(body);
    this.sendResult(response, {success: true});
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
