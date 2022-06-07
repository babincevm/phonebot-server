const {model, Schema} = require('mongoose');
const bcrypt = require('bcryptjs');
const {JWT} = require('./../classes/');

let account_data = new Schema({
  login: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 30,
    index: true,
    match: [/^[a-zA-Z0-9]+$/, 'Login already in use'],
  },
  email: {
    type: String,
    required: false,
    unique: [true, 'E-mail already in use'],
    index: true,
    match: [
      /(?=[a-z0-9@.!#$%&'*+/=?^_‘{|}~-]{6,254})(?=[a-z0-9.!#$%&'*+/=?^_‘{|}~-]{1,64}@)[a-z0-9!#$%&'*+/=?^_‘{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_‘{|}~-]+)*@(?:(?=[a-z0-9-]{1,63}.)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+(?=[a-z0-9-]{1,63})[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      'Invalid email',
    ],
  },
  password: {
    required: true,
    type: String,
  },
}, {
  _id: false,
  timestamps: {
    createdAt: false,
    updatedAt: true,
  },
  minimize: true,
  strict: 'throw',
});

let user_data = new Schema({
  name: {
    type: String,
    required: false,
    default: null,
  },
  birthdate: {
    type: Date,
    required: false,
    default: null,
  },
  phone: {
    type: String,
    required: false,
    default: null,
    match: [
      /^((?:\+7|[78])[ \-(]{0,2}9\d{2}[ \-)]{0,2}\d{3}[ -]?\d{2}[ -]?\d{2})$/,
      'Invalid phone',
    ],
  },
}, {
  _id: false,
  timestamps: {
    createdAt: false,
    updatedAt: true,
  },
  minimize: true,
  strict: 'throw',
});

let userSchema = new Schema({
  account_data: {
    type: account_data,
    required: true,
  },
  user_data: {
    type: user_data,
    required: false,
  },
  card: {
    type: Schema.Types.ObjectId,
    ref: 'Card',
    validate: {
      validator: val => model('Card').exists(val),
      message: 'Invalid id for Card'
    }
  },

}, {
  timestamps: true,
  collection: 'User',
  strict: 'throw',
});

/**
 * Получение пользователя по id
 * @param {String} id
 * @return {Promise<*>}
 */
userSchema.statics.getById = async function(id) {
  return await this.findById(id);
};

/**
 * Получение пользователя по логину
 * @param login
 * @return {Promise<*>}
 */
userSchema.statics.getByLogin = async function(login) {
  return await this.findOne({'account_data.login': login});
};

/**
 * Хеширование пароля перед сохранением в бд и обновлением профиля
 */
userSchema.pre(['save', 'updateOne'], async function(next) {
  try {
    this.account_data.password = await bcrypt.hash(
      this.account_data.password,
      await bcrypt.genSalt(10),
    );
  } catch (e) {
    return next(e);
  }
  return next();
});

/**
 * Сравнение переданного пароля с хешем из бд
 * @param password
 * @return {Promise<boolean>}
 */
userSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.account_data.password);
};

/**
 * Генерация токена
 * @return {Promise<*>}
 */
userSchema.methods.generateToken = async function(payload) {
  return await JWT.sign(payload, this._id.toString());
};

module.exports = model('User', userSchema);
