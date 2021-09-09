const CRUD = require('../CRUD');


class Question extends CRUD {

  async create({body}, res, next) {
    console.log(body);

    return this.sendResult(res, {data: 'true'});
  }

  async getBySubgroup() {}
}


module.exports = Question;
