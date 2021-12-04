const CRUD = require('../CRUD');


class SubgroupController extends CRUD {
  getAll({params: {parent_id}}, res, next) {
    this.model.find().byParent(parent_id).exec(
      (err, result) => err ? next(err) : this.sendResult(res, result),
    );
  }

  async create({params: {parent_id}, body}, res, next) {
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


class SurveySubgroup extends SubgroupController {}


class TestSubgroup extends SubgroupController {}


module.exports = {
  SurveySubgroup,
  TestSubgroup,
};
