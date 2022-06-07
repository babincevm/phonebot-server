const {model, Schema, Types} = require('mongoose');

const SubgroupSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  parent: {
    type: Types.ObjectId,
    ref: 'Group',
    validate: {
      validator: val => model('Group').exists(val),
      message: 'Invalid id for Group',
    },
  },
  questions: [
    {
      type: Types.ObjectId,
      ref: 'Question',
      validate: {
        validator: val => model('Question').exists(val),
        message: 'Invalid id for Question'
      }
    }
  ]
}, {
  timestamps: true,
  discriminatorKey: '__type',
  collection: 'Subgroup',
  strict: 'throw',
});

SubgroupSchema.query.byParent = function(id) {
  return this.where({parent: id});
};

const SurveySubgroupSchema = new Schema(
  {},
  {
    strict: 'throw',
  },
);
const TestSubgroupSchema = new Schema(
  {},
  {
    strict: 'throw',
  });

const Subgroup = model('Subgroup', SubgroupSchema);
const SurveySubgroup = Subgroup.discriminator('Survey_subgroup',
  SurveySubgroupSchema);
const TestSubgroup = Subgroup.discriminator('Test_subgroup',
  TestSubgroupSchema);

module.exports = {
  SurveySubgroup,
  TestSubgroup,
  Subgroup,
};
