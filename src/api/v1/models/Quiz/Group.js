const {model, Schema, Types} = require('mongoose');

const GroupSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  parent: {
    type: Types.ObjectId,
    ref: 'Quiz',
    validate: {
      validator: val => model('Quiz').exists(val),
      message: 'Invalid id for Direction'
    }
  },
}, {
  timestamps: true,
  discriminatorKey: '__type',
  collection: 'Group',
  strict: 'throw',
});

GroupSchema.query.byParent = function(id) {
  return this.where({parent: id});
};

const SurveyGroupSchema = new Schema(
  {},
  {
    strict: 'throw',
  });
const TestGroupSchema = new Schema(
  {},
  {
    strict: 'throw',
  },
);

const Group = model('Group', GroupSchema);
const SurveyGroup = Group.discriminator('Survey_group', SurveyGroupSchema);
const TestGroup = Group.discriminator('Test_group', TestGroupSchema);

module.exports = {
  SurveyGroup,
  TestGroup,
};
