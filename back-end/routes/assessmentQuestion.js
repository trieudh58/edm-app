var express = require('express');
var router= express.Router();
var authentication = require('../middleware/authentication');
var assessmentQuestionController = require('../controllers/assessmentQuestion');

router.post('/submit-system-assessment',authentication,assessmentQuestionController.submitSystemAssessment);

router.post('/submit-cource-class-assessment',authentication,assessmentQuestionController.submitCourseClassAssessment);

router.get('/get-question-list-by-purpose',authentication,assessmentQuestionController.getQuestionSetOnPurpose);

router.get('/get-assessment-question-purpose-list',authentication,assessmentQuestionController.getStudentAssessmentQuestionSetType);

module.exports = router;