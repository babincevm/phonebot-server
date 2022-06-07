const {
  testHelpers: {Request, Validate},
  functions: {getRandomString, deepLog},
} = require('../../src/api/v1/helpers/');
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

function fetchBySubgroup(subgroupId) {
  if (!subgroupId) {
    subgroupId = subgroup._id;
  }

  return new Promise(((resolve, reject) => {
    request.get(({url: `/subgroup/${subgroupId}/`})).
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

  it('Should not create question due to absence of question text',
    function(done) {
      let incorrectQuestionData = JSON.parse(
        JSON.stringify(correctQuestionData));
      delete incorrectQuestionData.text;

      createQuestion(null, incorrectQuestionData).then(({status, data}) => {
        validate.status(status, 400);
        validate.incorrect(data);
        validate.message(data, '`text`');

        return done();
      }).catch(e => done(e));
    });

  it('Should not create question die to absence of answer text',
    function(done) {
      let incorrectQuestionData = JSON.parse(
        JSON.stringify(correctQuestionData));
      delete incorrectQuestionData.answers[0].text;

      createQuestion(null, incorrectQuestionData).then(({status, data}) => {
        console.log('data: ', data);
        validate.status(status, 400);
        validate.incorrect(data);
        validate.message(data, '`text`');

        return done();
      }).catch(e => done(e));
    });

  it('Should not create question due to absence of answers', function(done) {
    let incorrectQuestionData = JSON.parse(
      JSON.stringify(correctQuestionData));

    delete incorrectQuestionData.answers;

    createQuestion(null, incorrectQuestionData).then(({status, data}) => {
      console.log('data: ', data);
      validate.status(status, 400);
      validate.incorrect(data);
      validate.message(data, '`answers`');

      return done();
    }).catch(e => done(e));
  });

  it('Should not create question due to absence of text of answer option',
    function(done) {
      let incorrectQuestionData = JSON.parse(
        JSON.stringify(correctQuestionData));
      delete incorrectQuestionData.answers[0].options[0].text;

      createQuestion(null, incorrectQuestionData).then(({status, data}) => {
        validate.status(status, 400);
        validate.incorrect(data);
        validate.message(data, '`text`');

        return done();
      }).catch(e => done(e));
    });

  it('Should get all questions', function(done) {
    request.get({url: '/all/'}).then(({status, data}) => {
      validate.correct(status, data);
      validate.hasResult(data);
      validate.arrayLength(data.result, 1);

      return done();
    }).catch(e => done(e));
  });
});
