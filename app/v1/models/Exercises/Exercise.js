const {model, Schema, Types} = require('mongoose');
const {CustomError} = require('./../../classes');
const file = require('../File');

const ExerciseSchema = new Schema({
  /**
   * A - advanced
   * B - base
   */
  complexity: {
    type: String,
    required: false,
    default: 'B',
    enum: ['A', 'B'],
  },
  title: {
    Type: String,
    required: false,
    default: '',
  },
  description: {
    type: String,
    required: true,
  },
  instruction: {
    type: String,
    required: false,
    default: null,
  },
  file,
  times: {
    type: String,
    required: false,
    default: '1',
  },
  control: {
    type: String,
    required: false,
    default: null,
  },
  note: {
    type: String,
    required: false,
    default: null,
  }
});

module.exports = model('Exercise', ExerciseSchema);
