const CRUD = require('../CRUD');
const {ErrorProvider} = require('./../../classes');
const {Survey, Test} = require('./../../models');


class GroupController extends CRUD {
  getAll({params: {parent_id}}, res, next) {
    this.model.find().byParent(parent_id).exec(
      (err, result) => err ? next(err) : this.sendResult(res, result),
    );
  }

  async create({params: {parent_id}, body}, res, next) {
    if (!await this.isParentExists(parent_id)) {
      return next(new ErrorProvider('Parent id is not found').NotFound());
    }
    let created;
    try {
      created = await new this.model({...body, parent: parent_id}).save(
        {new: true, timestamps: true});
    } catch (err) {
      return next(err);
    }
    return this.sendResult(res, created);
  }
}


class SurveyGroup extends GroupController {
  async isParentExists(parentId) {
    return await Survey.exists({_id: parentId});
  }
}


class TestGroup extends GroupController {
  async isParentExists(parentId) {
    return await Test.exists({_id: parentId});
  }
}


module.exports = {
  SurveyGroup,
  TestGroup,
};
