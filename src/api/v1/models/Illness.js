const {model, Schema, Types} = require('mongoose');

const IllnessSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = model('Illness', IllnessSchema);
