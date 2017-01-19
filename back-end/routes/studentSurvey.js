var express = require('express');
var router= express.Router();
var authentication = require('../middleware/authentication');
var studentSurveyController = require('../controllers/studentSurvey');

/* get question list for student survey*/
router.get('/get-student-survey-question-list',authentication,studentSurveyController.getQuestionList);
/* submit answer */
router.post('/submit-student-survey',authentication,studentSurveyController.submitStudentSurvey);

module.exports = router;