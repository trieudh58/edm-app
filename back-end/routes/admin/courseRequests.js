var express = require('express');
var adminRouter = express.Router();
var AdminCourseRequestController = require('../../controllers/courseRequests');
var authentication = require('../../middleware/authentication');
var adminpermission = require('../../middleware/adminPermission');



module.exports = adminRouter;