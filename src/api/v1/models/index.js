const mongoose = require('mongoose');
const {mongoose_plugins} = require('../helpers');

// mongoose.plugin(mongoose_plugins.selectFor);

const {
  Survey,
  Test,
  SurveyGroup,
  TestGroup,
  SurveySubgroup,
  TestSubgroup,
} = require('./Quiz');
const Question = require('./Quiz/Question');
const User = require('./User');
const Card = require('./PatientCard');
const {Exercise, ExerciseDirection, ExerciseGroup, ExerciseSubgroup} = require(
  './Exercises');
const Illness = require('./Illness');
const Role = require('./Role');

module.exports = {
  Survey,
  Test,
  SurveyGroup,
  TestGroup,
  SurveySubgroup,
  TestSubgroup,

  Question,
  User,
  Card,
  Illness,

  Exercise,
  ExerciseDirection,
  ExerciseGroup,
  ExerciseSubgroup,

  Role,
};
