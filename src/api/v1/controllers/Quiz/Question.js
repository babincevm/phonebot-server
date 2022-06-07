const CRUD = require('../CRUD');
const {Subgroup} = require('./../../models/');
const {ErrorProvider} = require('./../../classes');


class Question extends CRUD {
  async create({body, params: {subgroup_id}}, res, next) {
    if (!await this.isParentExists(subgroup_id)) {
      return next(new ErrorProvider('Subgroup not found').NotFound());
    }
    let question;
    try {
      question = await new this.model(body).save(
        {new: true, timestamps: true},
      );
    } catch (e) {
      return next(e);
    }

    return this.sendResult(res, question);
  }

  async getBySubgroup({params: {subgroup_id}}, res, next) {
    if (!await this.isParentExists(subgroup_id)) {
      return next(new ErrorProvider('Subgroup not found').NotFound());
    }

    let questions = await this.model.find({parent: subgroup_id});
    return this.sendResult(res, questions);
  }

  async isParentExists(subgroupId) {
    return await Subgroup.exists({_id: subgroupId});
  }
}


module.exports = Question;
