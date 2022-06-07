const models = require('../models');

/**
 * ==================================================QUIZ=======================
 */
const {Survey, Test} = require('./Quiz/Quiz');
const {SurveyGroup, TestGroup} = require('./Quiz/Group');
const {SurveySubgroup, TestSubgroup} = require('./Quiz/Subgroup');

const SurveyController = new Survey({model: models.Survey});
const TestController = new Test({model: models.Test});
const SurveyGroupController = new SurveyGroup({model: models.SurveyGroup});
const TestGroupController = new TestGroup({model: models.TestGroup});
const SurveySubgroupController = new SurveySubgroup(
  {model: models.SurveySubgroup},
);
const TestSubgroupController = new TestSubgroup({model: models.TestSubgroup});
/**
 * =================================================/QUIZ=======================
 */


const Question = require('./Quiz/Question');
const QuestionController = new Question({model: models.Question});

const User = require('./User');
const UserController = new User({model: models.User});

const Exercise = require('./Exercise/Exercise');
const ExerciseDirection = require('./Exercise/ExerciseDirection');
const ExerciseGroup = require('./Exercise/ExerciseGroup');
const ExerciseSubgroup = require('./Exercise/ExerciseSubgroup');

const ExerciseController = new Exercise({model: models.Exercise});
const ExerciseDirectionController = new ExerciseDirection(
  {model: models.ExerciseDirection});
const ExerciseGroupController = new ExerciseGroup(
  {model: models.ExerciseGroup});
const ExerciseSubgroupController = new ExerciseSubgroup(
  {model: models.ExerciseSubgroup});

module.exports = {
  SurveyController,
  TestController,
  SurveyGroupController,
  TestGroupController,
  SurveySubgroupController,
  TestSubgroupController,

  QuestionController,

  UserController,

  ExerciseController,
  ExerciseDirectionController,
  ExerciseGroupController,
  ExerciseSubgroupController,
};
