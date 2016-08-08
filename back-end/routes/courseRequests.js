var express = require('express');
var router = express.Router();
var CourseRequestController = require('../controllers/courseRequests');
var authentication = require('../middleware/authentication');

/* Create new Course request */
router.post('/create', authentication, CourseRequestController.create);

module.exports = router;