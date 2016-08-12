var express = require('express');
var router = express.Router();
var CourseRequestController = require('../controllers/courseRequests');
var authentication = require('../middleware/authentication');
var validation = require('../validation');

/* Create new Course request */
router.post('/create', validation.courseRequests.create, authentication, CourseRequestController.create);

/* Join one Course request created by others */
router.put('/join', validation.courseRequests.join, authentication, CourseRequestController.join);

/* Undo-join one Course request */
router.put('/undo-join', validation.courseRequests.undoJoin, authentication, CourseRequestController.undoJoin);

/* Get one Course request by id */
router.get('/get-by-id', authentication, CourseRequestController.getById);

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
router.delete('/delete-one', validation.courseRequests.deleteOne, authentication, CourseRequestController.deleteOne);

module.exports = router;