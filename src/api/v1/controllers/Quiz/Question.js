const CRUD = require('../CRUD');
const {ErrorProvider} = require('./../../classes');


class Question extends CRUD {
  async getAnswerIndex(question, answer_id) {
    let answerIndex = question.answers.findIndex(
      answer => answer._id.equals(answer_id),
    );
    if (answerIndex < 0) {
      new ErrorProvider('Answer not found').NotFound().throw();
    }
    return answerIndex;
  }

  async create({body, params: {subgroup_id}}, res, next) {
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

  async addAnswer({body, params: {id}}, res, next) {
    let question = await this.getDocumentById(id);
    question.answers.push(body);
    await question.save();
    return this.sendResult(res, question);
  }

  async addOption({body, params: {id, answer_id}}, res, next) {
    let question = await this.getDocumentById(id);
    let answerIndex = await this.getAnswerIndex(question, answer_id);
    question.answers[answerIndex].options.push(body);
    return this.sendResult(res, question);
  }

  async deleteAnswer({params: {id, answer_id}}, res, next) {
    let question = await this.getDocumentById(id);
    let answerIndex = await this.getAnswerIndex(question, answer_id);

    question.answers.splice(answerIndex, 1);
    return this.sendResult(res, question);
  }

  async deleteOption({params: {id, answer_id, option_id}}, res, next) {
    let question = await this.getDocumentById(id);
    let answerIndex = await this.getAnswerIndex(question, answer_id);
    let optionIndex = question.answers[answerIndex].options.findIndex(
      opt => opt._id.equals(option_id),
    );
    if (optionIndex < 0) {
      return next(new ErrorProvider('Option not found').NotFound());
    }
    question.answers[answerIndex].options.splice(optionIndex, 1);
    return this.sendResult(res, question);
  }
}


module.exports = Question;
