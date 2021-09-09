const router = require('express-promise-router')();
const {routeMiddleWare} = require('./../middlewares');
const {
  SurveyController,
  TestController,
  SurveyGroupController,
  TestGroupController,
  SurveySubgroupController,
  TestSubgroupController,
} = require('./../controllers');

router.get('/survey/', (...props) => SurveyController.getAll(...props));
router.get('/survey/:id/', (...props) => SurveyController.getById(...props));
router.get('/survey/:id/groups/',
  (...props) => SurveyGroupController.getAll(...props));
router.get('/survey/group/:id/',
  (...props) => SurveyGroupController.getById(...props));
router.get('/survey/group/:parent_id/subgroups/',
  (...props) => SurveySubgroupController.getAll(...props));
router.get('/survey/subgroup/:id/',
  (...props) => SurveySubgroupController.getById(...props));

router.post('/survey/', (...props) => SurveyController.create(...props));
router.post('/survey/:parent_id/group/',
  (...props) => SurveyGroupController.create(...props));
router.post('/survey/group/:parent_id/subgroup/',
  (...props) => SurveySubgroupController.create(...props));

router.patch('/survey/:id',
  (...props) => routeMiddleWare.prePatch(...props, 'Survey'),
  (...props) => SurveyController.update(...props));
router.patch('/survey/group/:id',
  (...props) => routeMiddleWare.prePatch(...props, 'SurveyGroup'),
  (...props) => SurveyGroupController.update(...props));
router.patch('/survey/subgroup/:id',
  (...props) => routeMiddleWare.prePatch(...props, 'SurveySubgroup'),
  (...props) => SurveySubgroupController.update(...props));

router.delete('/survey/:id', (...props) => SurveyController.remove(...props));
router.delete('/survey/group/:id',
  (...props) => SurveyGroupController.remove(...props));
router.delete('/survey/subgroup/:id',
  (...props) => SurveySubgroupController.remove(...props));

router.get('/test/', (...props) => TestController.getAll(...props));
router.get('/test/:id/', (...props) => TestController.getById(...props));
router.get('/test/:parent_id/groups/',
  (...props) => TestGroupController.getAll(...props));
router.get('/test/group/:id/',
  (...props) => TestGroupController.getById(...props));
router.get('/test/group/:parent_id/subgroups/',
  (...props) => TestSubgroupController.getAll(...props));
router.get('/test/subgroup/:id/',
  (...props) => TestSubgroupController.getById(...props));

router.post('/test/', (...props) => TestController.create(...props));
router.post('/test/:parent_id/group/',
  (...props) => TestGroupController.create(...props));
router.post('/test/group/:parent_id/subgroup/',
  (...props) => TestSubgroupController.create(...props));

router.patch('/test/:id',
  (...props) => routeMiddleWare.prePatch(...props, 'Test'),
  (...props) => TestController.update(...props));
router.patch('/test/group/:id',
  (...props) => routeMiddleWare.prePatch(...props, 'TestGroup'),
  (...props) => TestGroupController.update(...props));
router.patch('/test/subgroup/:id',
  (...props) => routeMiddleWare.prePatch(...props, 'TestSubgroup'),
  (...props) => TestSubgroupController.update(...props));

router.delete('/test/:id', (...props) => TestController.remove(...props));
router.delete('/test/group/:id',
  (...props) => TestGroupController.remove(...props));
router.delete('/test/subgroup/:id',
  (...props) => TestSubgroupController.remove(...props));

// router.post('/test/subgroup/:subgroup_id/question/', (...props) =>
// QuestionController.create(...props));
// router.post('/survey/subgroup/:subgroup_id/question/', (...props) =>
// QuestionController.create(...props));

module.exports = router;
