var express = require('express');
var router = express.Router();
var CourseRequestController = require('../controllers/courseRequests');
var authentication = require('../middleware/authentication');

/* Create new Course request */
router.post('/create', authentication, CourseRequestController.create);

/* Get created Course requests */
router.get('/get-own-created', authentication, CourseRequestController.getOwnCreatedCRs);

/* Get public Course requests */
router.get('/get-own-public', authentication, CourseRequestController.getOwnPublicCRs);

/* Get pending Course requests */
router.get('/get-own-pending', authentication, CourseRequestController.getOwnPendingCRs);

module.exports = router;