const {model, Schema} = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = process.env.secret;

let password = new Schema({
  hash: String,
  salt: String,
}, {
  _id: false,
  timestamps: true,
});

let account_data = new Schema({
  login: {
    type: String,
    required: [true, 'Логин не может быть пустым'],
    unique: true,
    minlength: 5,
    maxlength: 30,
    index: true,
    match: [/^[a-zA-Z0-9]+$/, 'Некорректный логин'],
  },
  email: {
    type: String,
    required: false,
    unique: true,
    minlength: 5,
    maxlength: 30,
    index: true,
    match: [
      /^([a-zA-Z0-9]+)@([a-zA-Z].*)\.([a-zA-Z]{2,6})$/,
      'Некорректный e-mail'],
  },
  /**
   * Тип пользователя
   * A - админ
   * B - логопед
   * C - обычный пользователь
   */
  user_type: {
    type: String,
    minlength: 1,
    maxlength: 1,
    uppercase: true,
    enum: ['A', 'B', 'C'],
    default: 'C',
  },
  password,
}, {
  _id: false,
  timestamps: true,
  minimize: true,
});

let user_data = new Schema({
  name: String,
  birthdate: Date,
  phone: String,
}, {
  _id: false,
  timestamps: true,
  minimize: true,
});

let userModel = new Schema({
  account_data,
  user_data,
  card: {
    type: Schema.Types.ObjectId,
    ref: 'Card',
  },

}, {
  timestamps: true,
  // autoCreate: false,
});

/**
 * генерация хеша и соли пароля
 */
userModel.methods.setPassword = function(password) {
  let salt = crypto.randomBytes(16).toString('hex');
  this.account_data.password.salt = salt;
  this.account_data.password.hash = crypto.pbkdf2Sync(password, salt, 10000,
    512, 'sha512').toString('hex');
};
/**
 * валидация пароля
 */
userModel.methods.isPasswordValid = function(password) {
  return this.account_data.password.hash ===
    crypto.pbkdf2Sync(password, this.account_data.password.salt, 10000, 512,
      'sha512').toString('hex');
};

/**
 * генерация JWT для пользователя
 */
userModel.methods.generateJWT = function() {
  const today = new Date();
  const expires = new Date(today);
  expires.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.account_data.login,
    exp: parseInt((expires.getTime() / 1000).toString()),
  }, secret);
};

userModel.methods.toAuthJSON = function() {
  return {
    login: this.account_data.login,
    token: this.generateJWT(),
  };
};

module.exports = model('User', userModel);

// TODO: протестировать эту штуку
/**
 * Кастомизация публичных полей документа
 */
// if (!user.options.toObject) user.options.toObject = {};

// user.options.toObject.transform = function (doc, ret, options) {
//     delete ret.createdAt;
//     delete ret.updatedAt;
//     delete ret.user_data.password;
//     delete ret.user_data.user_type;
//     return ret;
// }
