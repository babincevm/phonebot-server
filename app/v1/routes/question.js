const router = require('express-promise-router')();
const {routeMiddleWare} = require('./../middlewares');
const {QuestionController} = require('./../controllers');

router.get('/all/', (...props) => QuestionController.getAll(...props));
router.get('/subgroup/:subgroup_id/', (...props) => QuestionController.getBySubgroup(...props));
router.get('/:id/', (...props) => QuestionController.getById(...props));

router.post('/', (...props) => QuestionController.create(...props));

router.delete('/:id/', (...props) => QuestionController.remove(...props));

router.patch('/:id/', (...props) => QuestionController.update(...props));

module.exports = router;
