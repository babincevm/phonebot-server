const {model, Schema} = require('mongoose');
const file = require('./File');

let common_fields = {
  patient_answer: Schema.Types.Mixed,
  answer_type: String,
  file,
  therapist_notes: {
    type: String,
    required: false,
    default: '',
  },
};

const answer = new Schema({
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
    validate: {
      validator: val => model('Question').exists(val),
      message: 'Invalid id for Question'
    }
  },
  ...common_fields,
});

let exercise = new Schema({
  exercise: {
    type: Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true,
    validate: {
      validator: val => model('Exercise').exists(val),
      message: 'Invalid id for Exercise'
    }

  },
  ...common_fields,
});

// answer.pre('save', function(next) {
//   switch (typeof this.patient_answer) {
//   case 'Array': {
//     console.log('arr');
//     break;
//   }
//   }
//   return next();
// });

const PatientCard = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  therapist: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  diagnosis_survey: [answer],
  diagnosis_tests: [answer],
  exercises: [exercise],
  therapist_notes: {
    type: String,
    required: false,
    default: '',
  },
});

module.exports = model('Card', PatientCard);
