const router = require('express-promise-router')();
const {CardController} = require('../controllers');

router.get('/:id/exercises/', (...props) => CardController.getExercises(props));
router.get('/:id/questions/', (...props) => CardController.getQuestions(props));
router.get('/:id/exercise/:exercise_id/',
  (...props) => CardController.getExerciseById(props));
router.get('/:id/question/:question_id/',
  (...props) => CardController.getQuestionById(props));

router.post('/', (...props) => CardController.create(props));
router.post('/:id/note/', (...props) => CardController.addNote(props));
router.post('/:id/question/:question_id/note/',
  (...props) => CardController.addQuestionNote(props));
router.post('/:id/exercise/:exercise_id/note/',
  (...props) => CardController.addExerciseNote(props));
router.post('/:id/exercises/',
  (...props) => CardController.setExercises(props));
router.post('/diagnosis/',
  (...props) => CardController.setDiagnosisAnswer(props));

router.delete('/:id/exercise/:exercise_id/',
  (...props) => CardController.removeExercise(props));
router.delete('/:id/', (...props) => CardController.remove(props));

router.patch('/:id/therapist/',
  (...props) => CardController.setTherapist(props));

router.patch('/:id/exercise/:exercise_id/',
  (...props) => CardController.setExerciseAnswer(props));
