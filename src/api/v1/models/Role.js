const {model, Schema} = require('mongoose');

let roleSchema = new Schema({
  type: {
    type: String,
    minlength: 1,
    maxlength: 1,
    required: false,
    uppercase: true,
    enum: ['admin', 'doctor', 'user'],
    default: 'user',
  },
  title: {
    type: String,
    required: false,
    default: '',
  },
}, {
  timestamps: true,
  collection: 'Role',
  // autoCreate: false,
});

module.exports = model('Role', roleSchema);
