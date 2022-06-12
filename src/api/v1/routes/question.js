const router = require('express-promise-router')();
const {QuestionController} = require('../controllers');

router.get('/:id/', (...props) => QuestionController.getById(...props));
router.get('/all/', (...props) => QuestionController.getAll(...props));
router.get(
  '/subgroup/:subgroup_id/',
  (...props) => QuestionController.getBySubgroup(...props),
);

router.post(
  '/:subgroup_id/',
  (...props) => QuestionController.create(...props),
);
router.post(
  '/:id/answer/',
  (...props) => QuestionController.addAnswer(...props),
);
router.post(
  '/:id/answer/:answer_id/option/',
  (...props) => QuestionController.addOption(...props),
);

router.delete(
  '/:id/',
  (...props) => QuestionController.remove(...props),
);
router.delete(
  '/:id/answer/:answer_id/',
  (...props) => QuestionController.deleteAnswer(...props),
);
router.delete(
  '/:id/answer/:answer_id/option/:option_id/',
  (...props) => QuestionController.deleteOption(...props),
);

router.patch(
  '/:id/',
  (...props) => QuestionController.update(...props),
);
router.patch(
  '/:id/answer/:answer_id/',
  (...props) => QuestionController.updateAnswer(...props),
);
router.patch(
  '/:id/answer/:answer_id/option/:option_id/',
  (...props) => QuestionController.updateOption(...props),
);

module.exports = router;

