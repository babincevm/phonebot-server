const {model, Schema} = require('mongoose');
const {CustomError} = require('./../../classes');

const QuizSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
}, {
  timestamps: true,
  discriminatorKey: '__type',
  collection: 'Quiz',
});

/**
 * При удалении направления удаляются все группы с parent равным id удаленного документа
 */
// QuizSchema.post(['deleteOne', 'findOneAndDelete', 'findOneAndRemove'], async function (doc, next) {
//   if ( !doc ) return next(new CustomError({message: 'Quiz not found', status: 404}));
//
//   try {
//     let groups = await model('Group').find({}).byParent(doc._id);
//     if ( !groups ) return next();
//
//     for ( let group of groups ) {
//       group.remove();
//     }
//   } catch ( err ) {
//     return next(err);
//   }
//
//   return next();
// });

const SurveySchema = new Schema({});
const TestSchema = new Schema({});

const Quiz = model('Quiz', QuizSchema);
const Survey = Quiz.discriminator('Survey', SurveySchema);
const Test = Quiz.discriminator('Test', TestSchema);

module.exports = {
  Survey,
  Test,
};
