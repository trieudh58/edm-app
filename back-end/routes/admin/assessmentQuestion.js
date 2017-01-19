var express = require('express');
var router= express.Router();
var authentication = require('../../middleware/authentication');
var assessmentQuestionAdminController = require('../../controllers/admin/assessmentQuestion');
var adminPermission = require('../../middleware/adminPermission');

router.post('/create-question',authentication,adminPermission,assessmentQuestionAdminController.createAssessmentQuestion);

router.put('/update-question',authentication,adminPermission,assessmentQuestionAdminController.updateStudentAssessmentQuestion);

router.get('/get-purposes',authentication,adminPermission,assessmentQuestionAdminController.getStudentAssessmentQuestionSetType);

router.delete('/delete-question',authentication,adminPermission,assessmentQuestionAdminController.deleteAssessmentQuestion);

router.get('/get-all-system-questions',authentication,adminPermission,assessmentQuestionAdminController.getAllSystemQuestions);

router.get('/get-all-course-class-questions',authentication,adminPermission,assessmentQuestionAdminController.getAllCourseClassQuestions);

router.get('/get-list-system-assessment-set',authentication,adminPermission,assessmentQuestionAdminController.getListSystemAssessmentQuestionSet);

router.get('/get-list-course-class-assessment-set',authentication,adminPermission,assessmentQuestionAdminController.getListCourseClassAssessmentQuestionSet);

router.get('/get-assessment-set-by-id',authentication,adminPermission,assessmentQuestionAdminController.getAssessmentQuestionSet);

router.post('/add-questions-to-question-set',authentication,adminPermission,assessmentQuestionAdminController.addAssessmentQuestionsToQuestionSet);

router.post('/create-system-question-set',authentication,adminPermission,assessmentQuestionAdminController.createSystemQuestionSet);

router.post('/create-course-class-question-set',authentication,adminPermission,assessmentQuestionAdminController.createCourseClassQuestionSet);

router.delete('/delete-question-set',authentication,adminPermission,assessmentQuestionAdminController.deleteAssessmentQuestionSet);

router.put('/active-assessment-question-set',authentication,adminPermission,assessmentQuestionAdminController.activeQuestionSet);

router.get('/get-system-assessment-statistic',authentication,adminPermission,assessmentQuestionAdminController.getSystemAssessmentStatistic);

router.get('/get-course-class-assessment-statistic',authentication,adminPermission,assessmentQuestionAdminController.getCourseClassAssessmentStatistic);


module.exports = router;