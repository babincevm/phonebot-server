const {Schema} = require('mongoose');

const file = new Schema({
  original_name: String,
  size: Number,
  path: String,
}, {
  timestamps: true,
});

module.exports = file;
