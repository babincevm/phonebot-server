const router = require('express-promise-router')();
const {UserController} = require('../controllers');
const {Auth} = require('./../middlewares');

// Получение данных профиля
router.get('/profile/',
  [
    Auth.verifyToken,
  ],
  (...props) => UserController.getProfile(...props),
);

router.get('/patients/', (...props) => UserController.getPatients(...props));
// router.get('/quiz/', (...props) => UserController.getQuiz(...props));

// Авторизация пользователя
router.post('/login/',
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

module.exports = router;
