const {model, Schema, Types} = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Environment, ErrorProvider} = require('../classes/');
const {Mongoose} = require('./../plugins');

let account_data = new Schema({
  login: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 30,
    index: true,
    match: [/^[a-zA-Z0-9]+$/, 'Некорректный логин'],
  },
  email: {
    type: String,
    required: false,
    unique: [true, 'E-mail уже занят'],
    index: true,
    match: [
      /(?=[a-z0-9@.!#$%&'*+/=?^_‘{|}~-]{6,254})(?=[a-z0-9.!#$%&'*+/=?^_‘{|}~-]{1,64}@)[a-z0-9!#$%&'*+/=?^_‘{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_‘{|}~-]+)*@(?:(?=[a-z0-9-]{1,63}.)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+(?=[a-z0-9-]{1,63})[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      'Некорректный e-mail',
    ],
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: false,
    default: '618d1f261336b2ef037f2639',
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
      'Номер телефона введен некорректно',
    ],
  },
}, {
  _id: false,
  timestamps: {
    createdAt: false,
    updatedAt: true,
  },
  minimize: true,
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
  },

}, {
  timestamps: true,
  collection: 'User',
  // autoCreate: false,
});

userSchema.plugin(Mongoose.setFilteredToObject);

/**
 * Получение пользователя по id
 * @param {String} id
 * @return {Promise<*>}
 */
userSchema.statics.get = async function(id) {
  return await this.findById(id).getRole();
};

/**
 * Получение пользователя по логину
 * @param login
 * @return {Promise<*>}
 */
userSchema.statics.getByLogin = async function(login) {
  let user = await this.findOne({'account_data.login': login}).getRole();
  if (!user) {
    user = await this.findOne({'account_data.email': login}).getRole();
  }
  return user;
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
  if (!await bcrypt.compare(password, this.account_data.password)) {
    new ErrorProvider('Invalid password').BadRequest().throw();
  }

  return true;
};

/**
 * Получение роли пользователя
 * @return {*}
 */
userSchema.query.getRole = function() {
  return this.populate('account_data.role');
};

/**
 * Получение доступа к просматриваемым полям
 */
userSchema.virtual('fieldsAccess').get(async function() {
  if (!this.populated(this.account_data.role)) {
    await this.populate(this, {path: 'account_data.role'});
  }
  console.log('this.account_data.role.fields: ', this.account_data.role.fields);
  return this.account_data.role.fields;
});

/**
 * Генерация токена
 * @return {Promise<*>}
 */
userSchema.methods.generateToken = async function() {
  return await jwt.sign({},
    Environment.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '10s',
      issuer: Environment.SITE_URL,
      audience: this._id.toString(),
    },
  );
};

module.exports = model('User', userSchema);
