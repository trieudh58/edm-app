var express = require('express');
var router= express.Router();
var authentication = require('../../middleware/authentication');
var studentSurveyController = require('../../controllers/admin/studentSurvey');
var adminPermission = require('../../middleware/adminPermission');

router.post('/create-student-survey-question',authentication,adminPermission,studentSurveyController.createStudentSurveyQuestion);
router.put('/update-student-survey-question',authentication,adminPermission,studentSurveyController.updateStudentSurveyQuestion);
router.get('/get-question-type',authentication,adminPermission,studentSurveyController.getStudentSurveyQuestionType);
router.delete('/delete-question',authentication,adminPermission,studentSurveyController.deleteStudentSurveyQuestion);

module.exports = router;