var express = require('express');
var router = express.Router();
var RecommendationController = require('../controllers/recommendations');
var authentication = require('../middleware/authentication');
//var validation = require('../validation/recommendations');

/* Return study path */
router.get('/get-study-path', authentication, RecommendationController.getStudyPath);

/* Return next semester subjects */
router.get('/get-next-semester-subjects', authentication, RecommendationController.getNextSemesterSubjects);

module.exports = router;