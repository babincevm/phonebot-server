const {model, Schema} = require('mongoose');
const {CustomError} = require('./../../classes');

const ExerciseDirectionSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = model('ExerciseDirection', ExerciseDirectionSchema);
