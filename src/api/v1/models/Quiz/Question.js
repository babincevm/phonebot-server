const {model, Schema} = require('mongoose');
const file = require('../File');


const option = new Schema({
  text: String,
  type: String,
}, {
  minimize: true,
});

const answer = new Schema({
  text: String,
  options: [{
    type: option,
  }],
}, {
  timestamps: true,
  minimize: true,
});

const selector = new Schema({
  type: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
    validate: (val) => model('Quiz').exists(val),
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
    validate: (val) => model('Group').exists(val),
  },
  subgroup: {
    type: Schema.Types.ObjectId,
    ref: 'Subgroup',
    required: true,
    validate: (val) => model('Subgroup').exists(val),
  },
}, {
  _id: false,
});

const question = new Schema({
  text: {
    type: String,
    required: true
  },
  file,
  selector: {
    type: Map,
    of: selector,
    required: true,
    validate: (...props) => {
      console.log('valid quest');
      console.log(...props);
      return true;
    }
  },
  answers: [{
    type: answer,
  }],
}, {
  timestamps: true,
  minimize: true,
});

module.exports = model('Question', question);
