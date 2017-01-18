var express = require('express');
var adminRouter = express.Router();
var AdminStatisticsController = require('../../controllers/admin/statistics');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

/* Admins could get student detail */
adminRouter.get('/student-accounts', authentication, adminPermission, AdminStatisticsController.getStudentAccounts);

/* Admins could get student quantity grouped by management class */
adminRouter.get('/student-quantity-grouped-by-management-class', authentication, adminPermission, AdminStatisticsController.getStudentQuantityGroupedByManagementClass);

/* Admins could get student quantity grouped by academic year */
adminRouter.get('/student-quantity-grouped-by-academic-year', authentication, adminPermission, AdminStatisticsController.getStudentQuantityGroupedByAcademicYear);

/* Admins could get notification quantity */
adminRouter.get('/notification-quantity', authentication, adminPermission, AdminStatisticsController.getNotificationQuantity);

module.exports = adminRouter;