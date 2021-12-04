const BaseController = require('./Base');
const {ErrorProvider} = require('../classes');


class CRUD extends BaseController {
  getById({params: {id}}, res, next) {
    return this.model.findById(id,
      (err, result) => err ? next(err) : this.sendResult(res, result));
  }

  getAll(req, res, next) {
    return this.model.find(
      (err, result) => err ? next(err) : this.sendResult(res, result));
  }

  async create({body}, res) {
    return this.sendResult(res,
      await new this.model(body).save({timestamps: true}));
  }

  update({params: {id}, body}, res, next) {
    this.model.findByIdAndUpdate(id, body,
      {new: true},
      (err, result) => err ? next(err) : this.sendResult(res, result),
    );
  }

  remove({params: {id}}, res, next) {
    this.model.findByIdAndRemove(id, (err, doc_to_delete) => {
      if (err) return next(err);
      if (!doc_to_delete) return next(
        new ErrorProvider('Document not found').NotFound(),
      );

      return this.sendResult(res);
    });
  }
}


module.exports = CRUD;
