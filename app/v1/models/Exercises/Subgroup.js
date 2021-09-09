const {model, Schema, Types} = require('mongoose');
const {CustomError} = require('./../../classes');

const ExerciseSubgroupSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  parent: {
    type: Types.ObjectId,
    ref: 'ExerciseGroup',
  },
}, {
  timestamps: true,
});

module.exports = model('ExerciseSubgroup', ExerciseSubgroupSchema);
