const CRUD = require('../CRUD');
const {SurveyGroup, TestGroup} = require('./../../models');
const {ErrorProvider} = require('./../../classes');


class SubgroupController extends CRUD {
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


class SurveySubgroup extends SubgroupController {
  async isParentExists(parentId) {
    return await SurveyGroup.exists({_id: parentId});
  }
}


class TestSubgroup extends SubgroupController {
  async isParentExists(parentId) {
    return await TestGroup.exists({_id: parentId});
  }
}


module.exports = {
  SurveySubgroup,
  TestSubgroup,
};
