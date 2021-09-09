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
  },
  ...common_fields,
});

let exercise = new Schema({
  exercise: {
    type: Schema.Types.ObjectId,
    ref: 'Exercise',
  },
  ...common_fields,
});

answer.pre('save', function(next) {
  console.log(this);
  switch (typeof this.patient_answer) {
  case 'Array': {
    console.log('arr');
    break;
  }
  }
  return next();
});

const PatientCard = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  therapist: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
