const {model, Schema} = require('mongoose');

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
  strict: 'throw',
});

const SurveySchema = new Schema(
  {},
  {
    strict: 'throw',
  },
);
const TestSchema = new Schema(
  {},
  {
    strict: 'throw',
  },
);

const Quiz = model('Quiz', QuizSchema);
const Survey = Quiz.discriminator('Survey', SurveySchema);
const Test = Quiz.discriminator('Test', TestSchema);

module.exports = {
  Survey,
  Test,
};
