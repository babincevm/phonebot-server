const {model, Schema, Types} = require('mongoose');
const {CustomError} = require('./../../classes');

const GroupSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  parent: {
    type: Types.ObjectId,
    ref: 'Quiz',
  },
}, {
  timestamps: true,
  discriminatorKey: '__type',
  collection: 'Group',
});

GroupSchema.query.byParent = function (id) {
  return this.where({parent: id});
};

/**
 * Удаление всех субдокументов у модели по id родителя
 * @param {Model} model модель, для которой будет происходить удаление
 * @param {(String|Types.ObjectId)} id id родителя
 */
// async function deleteByParentId (model, id) {
//   await model.deleteMany({}, {document: true, query: false}).byParent(id);
// }

/**
 * При удалении группы удаляются все подгруппы с parent равным id удаленного документа
 */
// GroupSchema.post(['deleteOne', 'findOneAndDelete', 'findOneAndRemove', 'remove'], async function (doc, next) {
//   if ( !doc ) return next(new CustomError({status: 404, message: 'Document not found'}));
//   try {
//     await deleteByParentId(model('Subgroup'), doc._id);
//   } catch ( err ) {
//     return next(err);
//   }
//   return next();
// });
// GroupSchema.pre(['deleteOne', 'findOneAndDelete', 'findOneAndRemove', 'remove'], async function (doc, next) {
//   console.log(doc);
//   if ( !doc ) return next(new CustomError({status: 404, message: 'Document not found'}));
//   try {
//     await deleteByParentId(model('Subgroup'), doc._id);
//   } catch ( err ) {
//     return next(err);
//   }
//   return next();
// });

const SurveyGroupSchema = new Schema({});
const TestGroupSchema = new Schema({});

const Group = model('Group', GroupSchema);
const SurveyGroup = Group.discriminator('Survey_group', SurveyGroupSchema);
const TestGroup = Group.discriminator('Test_group', TestGroupSchema);

module.exports = {
  SurveyGroup,
  TestGroup,
};
