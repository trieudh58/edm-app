var express = require('express');
var adminRouter = express.Router();
var AdminCourseRequestController = require('../../controllers/admin/courseRequests');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

/* Public one Course request */
adminRouter.put('/public-one', authentication, adminPermission, AdminCourseRequestController.publicOne);

/* Add one Course request to pending */
adminRouter.put('/add-to-pending', authentication, adminPermission, AdminCourseRequestController.addToPending);

/* Deny one Course request */
adminRouter.put('/deny-one', authentication, adminPermission, AdminCourseRequestController.denyOne);

module.exports = adminRouter;