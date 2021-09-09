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
      message: 'Group not found',
    }
  }
}, {
  timestamps: true,
  discriminatorKey: '__type',
  collection: 'Subgroup',
});

SubgroupSchema.query.byParent = function(id) {
  return this.where({parent: id});
};
// SubgroupSchema.post(['deleteOne', 'findOneAndDelete', 'findOneAndRemove'], function (...props) {
//   console.log('subgroup post one');
//   console.log(props);
// });
// SubgroupSchema.pre(['deleteOne', 'findOneAndDelete', 'findOneAndRemove'], function (...props) {
//   console.log('subgroup pre one');
//   console.log(props);
// });
// SubgroupSchema.pre('deleteMany', function (...props) {
//   console.log('subgroup pre many');
//   console.log(props);
// });
// SubgroupSchema.post('deleteMany', function (...props) {
//   console.log('subgroup post many');
//   console.log(props);
// });

const SurveySubgroupSchema = new Schema({});
const TestSubgroupSchema = new Schema({});

const Subgroup = model('Subgroup', SubgroupSchema);
const SurveySubgroup = Subgroup.discriminator('Survey_subgroup', SurveySubgroupSchema);
const TestSubgroup = Subgroup.discriminator('Test_subgroup', TestSubgroupSchema);

module.exports = {
  SurveySubgroup,
  TestSubgroup
};
