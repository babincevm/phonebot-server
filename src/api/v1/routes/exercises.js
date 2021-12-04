const router = require('express-promise-router')();
const {
  ExerciseController,
  ExerciseDirectionController,
  ExerciseGroupController,
  ExerciseSubgroupController,
} = require('../controllers');

router.get('/directions/',
  (...props) => ExerciseDirectionController.getAll(props));
router.get('/direction/:id/',
  (...props) => ExerciseDirectionController.getById(props));

router.patch('/direction/:id/',
  (...props) => ExerciseDirectionController.update(props));
router.delete('/direction/:id/',
  (...props) => ExerciseDirectionController.remove(props));

router.post('/direction/',
  (...props) => ExerciseDirectionController.create(props));

router.get('/direction/:id/groups/',
  (...props) => ExerciseGroupController.getAll(props));
router.get('/group/:id/', (...props) => ExerciseGroupController.getById(props));

router.patch('/group/:id/',
  (...props) => ExerciseGroupController.update(props));
router.delete('/group/:id/',
  (...props) => ExerciseGroupController.remove(props));

router.post('/direction/:parent_id/group/',
  (...props) => ExerciseGroupController.create(props));

router.get('/group/:id/subgroups/',
  (...props) => ExerciseSubgroupController.getAll(props));
router.get('/subgroup/:id/',
  (...props) => ExerciseSubgroupController.getById(props));

router.patch('/subgroup/:id/',
  (...props) => ExerciseSubgroupController.update(props));
router.delete('/subgroup/:id/',
  (...props) => ExerciseSubgroupController.remove(props));

router.post('/group/:parent_id/subgroup/',
  (...props) => ExerciseSubgroupController.create(props));

router.get('/subgroups/:id/exercises/',
  (...props) => ExerciseController.getAll(props));
router.get('/:id/', (...props) => ExerciseController.getById(props));

router.patch('/:id/', (...props) => ExerciseController.update(props));
router.delete('/:id/', (...props) => ExerciseController.remove(props));

router.get('/subgroups/:parent_id/exercise/',
  (...props) => ExerciseController.create(props));

module.exports = router;
