var express = require('express');
var adminRouter = express.Router();
var AdminCourseRequestController = require('../../controllers/admin/courseRequests');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

adminRouter.put('/public-one', authentication, adminPermission, AdminCourseRequestController.publicOne);

module.exports = adminRouter;