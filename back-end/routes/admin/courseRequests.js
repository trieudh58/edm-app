var express = require('express');
var adminRouter = express.Router();
var AdminCourseRequestController = require('../../controllers/admin/courseRequests');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

/* Public one Course request */
adminRouter.put('/public-one', authentication, adminPermission, AdminCourseRequestController.publicOne);

/* Add one Course request to pending */
adminRouter.put('/add-to-pending', authentication, adminPermission, AdminCourseRequestController.addToPending);

module.exports = adminRouter;