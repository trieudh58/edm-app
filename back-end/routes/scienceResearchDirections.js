var express = require('express');
var router = express.Router();
var ScienceResearchDirectionController = require('../controllers/scienceResearchDirections');
var authentication = require('../middleware/authentication');
var validation = require('../validation/scienceResearchDirections');

/* Get science research directions list */
router.get('/get-list', authentication, ScienceResearchDirectionController.getList);

/* Get science research direction by lecturer */
router.get('/get-by-lecturer', authentication, ScienceResearchDirectionController.getByLecturer);

/* Get science research direction by workplace */
router.get('/get-by-workplace', authentication, ScienceResearchDirectionController.getByWorkplace);

/* Get lecturers */
router.get('/get-lecturers', authentication, ScienceResearchDirectionController.getLecturers);

/* Get workplaces */
router.get('/get-workplaces', authentication, ScienceResearchDirectionController.getWorkplaces);

module.exports = router;