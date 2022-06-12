const {model, Schema, Types} = require('mongoose');
const {ErrorProvider} = require('./../../classes');
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
      validator: async val => {
        if (await model('Quiz').exists(val)) return true;
        new ErrorProvider('Invalid id for Direction').NotFound().throw();
      },
    },
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
