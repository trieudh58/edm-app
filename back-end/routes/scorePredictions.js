var express = require('express');
var router = express.Router();
var ScorePredictionController = require('../controllers/scorePredictions');
var authentication = require('../middleware/authentication');
var validation = require('../validation/scorePredictions');

/* Predict score of one subject */
router.get('/predict-one-subject',validation.predictOneSubject, authentication, ScorePredictionController.predictOneSubject);

/* Predict list of subjects */
router.get('/predict-list-of-subjects', validation.predictListOfSubjects, authentication, ScorePredictionController.predictListOfSubjects);

module.exports = router;