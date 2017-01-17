var express = require('express');
var adminRouter = express.Router();
var AdminStatisticsController = require('../../controllers/admin/statistics');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

/* Admins could get student detail */
adminRouter.get('/get-student-detail', authentication, adminPermission, AdminStatisticsController.getStudentDetail);

module.exports = adminRouter;