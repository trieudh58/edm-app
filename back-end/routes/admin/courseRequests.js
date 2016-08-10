var express = require('express');
var adminRouter = express.Router();
var AdminCourseRequestController = require('../../controllers/admin/courseRequests');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

/* Get all public Course requests */
adminRouter.get('/get-all-public', authentication, adminPermission, AdminCourseRequestController.getAllPublic);

/* Get all pending Course requests */
adminRouter.get('/get-all-pending', authentication, adminPermission, AdminCourseRequestController.getAllPending);

/* Get all denied Course requests */
adminRouter.get('/get-all-denied', authentication, adminPermission, AdminCourseRequestController.getAllDenied);

/* Public one Course request */
adminRouter.put('/public-one', authentication, adminPermission, AdminCourseRequestController.publicOne);

/* Add one Course request to pending */
adminRouter.put('/add-to-pending', authentication, adminPermission, AdminCourseRequestController.addToPending);

/* Deny one Course request */
adminRouter.put('/deny-one', authentication, adminPermission, AdminCourseRequestController.denyOne);

module.exports = adminRouter;