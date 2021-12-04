const router = require('express-promise-router')();
const {IllnessController} = require('../controllers');

router.get('/', (...props) => IllnessController.getAll(...props));
router.get('/:id/', (...props) => IllnessController.getById(...props));

router.post('/', (...props) => IllnessController.create(...props));

router.patch('/:id', (...props) => IllnessController.update(...props));

router.delete('/:id/', (...props) => IllnessController.remove(...props));

module.exports = router;
