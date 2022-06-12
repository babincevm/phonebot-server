const {
  testHelpers: {Request, Validate},
  functions: {getRandomString, deepLog, copyObject},
} = require('../../src/api/v1/utils/');
const {
  createDirection,
  createGroup,
  createSubgroup,
  removeDirection,
  removeGroup,
  removeSubgroup,
} = require('./survey.test');

const {describe, it, before, after} = require('mocha');
const request = new Request({url: '/question'});
const validate = new Validate();

let direction = null;
let group = null;
let subgroup = null;
let question = null;

function createOption() {
  return {
    text: getRandomString(4),
  };
}

function createAnswer() {
  return {
    text: getRandomString(10),
    options: Array.from({length: 2}, () => createOption()),
  };
}

let correctQuestionData = {
  text: getRandomString(20),
  answers: Array.from({length: 5}, () => createAnswer()),
};

function createQuestion(subgroupId, questionData) {
  if (!subgroupId) {
    subgroupId = subgroup._id;
  }

  if (!questionData) {
    questionData = correctQuestionData;
  }

  return new Promise(((resolve, reject) => {
    request.post({url: `/${subgroupId}/`, data: questionData}).
      then(data => resolve(data)).
      catch(e => reject(e));
  }));
}

function removeQuestion(questionId) {
  if (!questionId) {
    questionId = question._id;
  }

  return new Promise(((resolve, reject) => {
    request.delete(({url: `/${questionId}/`})).
      then(data => resolve(data)).
      catch(e => reject(e));
  }));
}

describe('Question unit', function() {
  before(function(done) {
    let directionData = {
      title: getRandomString(),
    };
    createDirection(directionData).then(({status, data}) => {
      validate.correct(status, data);
      validate.hasResult(data);
      validate.objectHavePropertyName(data.result, '_id');
      validate.fieldEquality(data.result, 'title', directionData.title);
      direction = data.result;
      deepLog(direction, 'direction');

      let groupData = {
        title: getRandomString(),
      };
      createGroup(direction._id, groupData).then(({data, status}) => {
        deepLog(data, 'group');
        validate.correct(status, data);
        validate.hasResult(data);
        validate.objectInclude(data.result, groupData);
        validate.objectHavePropertyName(data.result, '_id');
        validate.fieldEquality(data.result, 'parent', direction._id);
        validate.fieldEquality(data.result, 'title', groupData.title);
        group = data.result;

        let subgroupData = {
          title: getRandomString(),
        };
        createSubgroup(group._id, subgroupData).then(({status, data}) => {
          deepLog(data, 'subgroup');
          validate.correct(status, data);
          validate.hasResult(data);
          validate.objectInclude(data.result, subgroupData);
          validate.objectHavePropertyName(data.result, '_id');
          validate.fieldEquality(data.result, 'parent', group._id);
          validate.fieldEquality(data.result, 'title', subgroupData.title);
          subgroup = data.result;

          createQuestion(null, correctQuestionData).then(({status, data}) => {
            deepLog(data.result, 'Question');
            validate.correct(status, data);
            validate.hasResult(data);
            validate.objectHavePropertyName(data.result, '_id');
            validate.objectHavePropertyName(data.result, 'answers');
            validate.arrayLength(data.result.answers,
              correctQuestionData.answers.length);

            console.log('correctQuestionData.answers[0]: ',
              correctQuestionData.answers[0]);
            deepLog(data.result.answers[0], 'data.result.answers');

            validate.fieldEquality(data.result, 'text',
              correctQuestionData.text);
            validate.fieldEquality(data.result.answers[0], 'text',
              correctQuestionData.answers[0].text);
            validate.arrayLength(data.result.answers[0].options,
              correctQuestionData.answers[0].options.length);
            validate.fieldEquality(data.result.answers[0].options[0], 'text',
              correctQuestionData.answers[0].options[0].text);

            question = data.result;
            return done();
          }).catch(e => done(e));
        }).catch(e => done(e));
      }).catch(e => done(e));
    }).catch(e => done(e));
  });

  after(function(done) {
    removeQuestion().then(({status, data}) => {
      deepLog(data, 'remove question');
      validate.correct(status, data);
      removeSubgroup(subgroup._id).then(({status, data}) => {
        deepLog(data, 'remove subgroup');
        validate.correct(status, data);
        removeGroup(group._id).then(({status, data}) => {
          deepLog(data, 'remove group');
          validate.correct(status, data);
          removeDirection(direction._id).then(({status, data}) => {
            deepLog(data, 'remove direction');
            validate.correct(status, data);
            return done();
          }).catch(e => done(e));
        }).catch(e => done(e));
      }).catch(e => done(e));
    }).catch(e => done(e));
  });

  describe('Question', function() {
    it('Should not create question due to absence of question text',
      function(done) {
        let incorrectQuestionData = copyObject(correctQuestionData);
        delete incorrectQuestionData.text;

        createQuestion(null, incorrectQuestionData).then(({status, data}) => {
          console.log('data: ', data);
          validate.status(status, 400);
          validate.incorrect(data);
          validate.message(data, '`text`');

          return done();
        }).catch(e => done(e));
      },
    );
    it('Should not create question due to absence of answer text',
      function(done) {
        let incorrectQuestionData = copyObject(correctQuestionData);
        delete incorrectQuestionData.answers[0].text;

        createQuestion(null, incorrectQuestionData).then(({status, data}) => {
          console.log('data: ', data);
          validate.status(status, 400);
          validate.incorrect(data);
          validate.message(data, '`text`');

          return done();
        }).catch(e => done(e));
      },
    );
    it('Should not create question due to absence of text of answer option',
      function(done) {
        let incorrectQuestionData = copyObject(correctQuestionData);
        delete incorrectQuestionData.answers[0].options[0].text;

        createQuestion(null, incorrectQuestionData).then(({status, data}) => {
          validate.status(status, 400);
          validate.incorrect(data);
          validate.message(data, '`text`');

          return done();
        }).catch(e => done(e));
      },
    );

  });

  describe('Answer', function() {
    it('Should add answer to question', function(done) {
      let newAnswer = createAnswer();
      request.post({
        url: `/${question._id}/answer/`,
        data: newAnswer,
      }).then(({status, data}) => {
        validate.correct(status, data);
        validate.hasResult(data);
        validate.objectHavePropertyName(data.result, 'answers');
        validate.arrayLength(
          data.result.answers,
          correctQuestionData.answers.length + 1,
        );
        let addedQuestion = data.result.answers[data.result.answers.length - 1];
        validate.objectHavePropertyName(addedQuestion, 'text', newAnswer.text);
        validate.objectHavePropertyName(
          addedQuestion.options[0],
          'text',
          newAnswer.options[0].text,
        );
        validate.objectHavePropertyName(
          addedQuestion.options[1],
          'text',
          newAnswer.options[1].text,
        );
        return done();
      }).catch(e => done(e));
    });
    it('Should not create answer due to invalid question ID', function(done) {
      let newAnswer = createAnswer();
      request.post({
        url: `/${question._id.slice(0, -3)}/answer/`,
        data: newAnswer,
      }).then(({status, data}) => {
        validate.status(status, 400);
        validate.incorrect(data);
        validate.message(data, 'Invalid id');
        return done();
      }).catch(e => done(e));
    });
    it('Should not create answer due to nonexistent question ID', function(done) {
      let newAnswer = createAnswer();
      request.post({
        url: `/${question._id.slice(0, -3) + '000'}/answer/`,
        data: newAnswer,
      }).then(({status, data}) => {
        validate.status(status, 404);
        validate.incorrect(data);
        validate.message(data, 'Question not found');
        return done();
      }).catch(e => done(e));
    });
    it('Should remove answer from question', function(done) {
      let answerId = question.answers[0]._id;
      request.delete({
        url: `/${question._id}/answer/${answerId}/`,
      }).then(({status, data}) => {
        console.log('data: ', data);
        validate.correct(status, data);
        validate.arrayLength(
          data.result.answers,
          question.answers.length - 1,
        );

        return done();
      }).catch(e => done(e));
    });
    it('Should not remove answer due to invalid question ID',
      function(done) {
        let answerId = question.answers[0]._id;
        request.delete({
          url: `/${question._id.slice(0, -3)}/answer/${answerId}/`,
        }).then(({status, data}) => {

          validate.incorrect(data);
          validate.status(status, 400);
          validate.message(data, 'Invalid id');

          return done();
        }).catch(e => done(e));
      },
    );
    it('Should not remove answer due to nonexistent question ID',
      function(done) {
        let answerId = question.answers[0]._id;
        request.delete({
          url: `/${question._id.slice(0, -3) + '000'}/answer/${answerId}/`,
        }).then(({status, data}) => {
          validate.incorrect(data);
          validate.status(status, 404);
          validate.message(data, 'Question not found');

          return done();
        }).catch(e => done(e));
      },
    );

    it.skip('Should remove option from answer', function(done) {
      return done('e');
    });

    it.skip('Should change option text', function(done) {
      return done('e');
    });

    it.skip('Should change answer text', function(done) {
      return done('e');
    });

    it.skip('Should change question text', function(done) {
      return done('e');
    });
  });

  describe('Option', function() {
    it('Should not create option due to invalid answer and question ID',
      function(done) {
        let answerId = question.answers[0]._id.splice(0, -3);

      },
    );

    it('Should add option to answer', function(done) {
      request.patch({
        url: `/${question._id}/answer/`,
      });
      return done('E');
    });
  });
});
