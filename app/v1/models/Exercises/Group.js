const {model, Schema, Types} = require('mongoose');
const {CustomError} = require('./../../classes');

const ExerciseGroupSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  parent: {
    type: Types.ObjectId,
    ref: 'ExerciseDirection',
  },
}, {
  timestamps: true,
});

module.exports = model('ExerciseGroup', ExerciseGroupSchema);
