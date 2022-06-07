const {model, Schema} = require('mongoose');
const file = require('../File');

const option = new Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false,
    default: 'text',
  },
}, {
  minimize: true,
});

const answer = new Schema({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [option],
    required: false,
  },
}, {
  timestamps: true,
  minimize: true,
});

const question = new Schema({
  text: {
    type: String,
    required: true,
  },
  file,
  answers: {
    type: [answer],
    required: true,
  },
}, {
  timestamps: true,
  minimize: true,
  strict: 'throw',
  collection: 'Question',
});

module.exports = model('Question', question);
