const {
  Survey,
  Test,
  SurveyGroup,
  TestGroup,
  Subgroup,
  SurveySubgroup,
  TestSubgroup,
} = require('./Quiz');
const Question = require('./Quiz/Question');
const User = require('./User');
const Card = require('./PatientCard');
const {Exercise, ExerciseDirection, ExerciseGroup, ExerciseSubgroup} = require(
  './Exercises');

module.exports = {
  Survey,
  Test,
  SurveyGroup,
  TestGroup,
  Subgroup,
  SurveySubgroup,
  TestSubgroup,

  Question,
  User,
  Card,

  Exercise,
  ExerciseDirection,
  ExerciseGroup,
  ExerciseSubgroup,
};
