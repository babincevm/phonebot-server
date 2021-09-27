const router = require('express-promise-router')();
const {UserController} = require('./../controllers');

// router.get('/:id/', (...props) => UserController.getById(...props));
router.get('/profile/', (...props) => UserController.getProfile(...props));
router.get('/patients/', (...props) => UserController.getPatients(...props));

router.post('/auth/', (...props) => UserController.auth(...props));
router.post('/register/', (...props) => UserController.register(...props));
router.post('/forget/', (...props) => UserController.recoverPassword(...props));

router.delete('/:id/', (...props) => UserController.remove(...props));

router.patch('/:id/', (...props) => UserController.update(...props));

module.exports = router;
