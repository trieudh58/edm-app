var express = require('express');
var router = express.Router();
var CourseRequestController = require('../controllers/courseRequests');
var authentication = require('../middleware/authentication');

/* Create new Course request */
router.post('/create', authentication, CourseRequestController.create);

/* Join one Course request created by others */
router.put('/join', authentication, CourseRequestController.join);

/* Get all created Course requests from all users */
router.get('/get-all-public', authentication, CourseRequestController.getAllPublicCRs);

/* Get created Course requests */
router.get('/get-own-created', authentication, CourseRequestController.getOwnCreatedCRs);

/* Get public Course requests */
router.get('/get-own-public', authentication, CourseRequestController.getOwnPublicCRs);

/* Get pending Course requests */
router.get('/get-own-pending', authentication, CourseRequestController.getOwnPendingCRs);

/* Get denied Course requests */
router.get('/get-own-denied', authentication, CourseRequestController.getOwnDeniedCRs);

/* Delete a Course request by id */
router.delete('/delete-one', authentication, CourseRequestController.deleteOne);

module.exports = router;