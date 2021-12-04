const router = require('express-promise-router')();
const {UserController} = require('../controllers');
const {Auth, Cache} = require('./../middlewares');
const {UserValidator} = require('./../validators');
const {UserFilter} = require('./../filters');

// Получение данных профиля
router.get('/profile/',
  [
    Auth.verifyToken,
    (req, res, next) => Cache.get(req, res, next, `user#${req.token.aud}`),
  ],
  (...props) => UserController.getProfile(...props),
);

router.get('/patients/', (...props) => UserController.getPatients(...props));
router.get('/quiz/', (...props) => UserController.getQuiz(...props));

// Авторизация пользователя
router.post('/login/',
  [
    UserValidator.login,
    UserFilter.login,
  ],
  (...props) => UserController.login(...props),
);

// Регистрация пользователя
router.post('/register/', [], (...props) => UserController.register(...props),
);

// Восстановление пароля
router.post('/forget/', [],
  (...props) => UserController.recoverPassword(...props));

// Удаление пользователя
router.delete('/', [
  Auth.verifyToken,
], (...props) => UserController.removeUser(...props));

// router.patch('/:id/', (...props) => UserController.update(...props));

module.exports = router;
