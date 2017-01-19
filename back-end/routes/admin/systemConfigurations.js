var express = require('express');
var adminRouter = express.Router();
var AdminSystemConfigurationController = require('../../controllers/admin/systemConfigurations');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');
var validation = require('../../validation/admin/systemConfigurations');

/* Admins read all system configurations */
adminRouter.get('/get-all', authentication, adminPermission, AdminSystemConfigurationController.getAll);

/* Admins reset all system configurations to default */
adminRouter.post('/reset', authentication, adminPermission, AdminSystemConfigurationController.reset);

/* Admins update SMTP configurations */
adminRouter.put('/update-smtp', validation.updateSMTP, authentication, adminPermission, AdminSystemConfigurationController.updateSMTP);

/* Admins enable account register functionality */
adminRouter.put('/enable-account-register', authentication, adminPermission, AdminSystemConfigurationController.enableAccountRegister);

/* Admins disable account register functionality */
adminRouter.put('/disable-account-register', authentication, adminPermission, AdminSystemConfigurationController.disableAccountRegister);

/* Admins enable course request functionality */
adminRouter.put('/enable-course-request', authentication, adminPermission, AdminSystemConfigurationController.enableCourseRequest);

/* Admins disable course request functionality */
adminRouter.put('/disable-course-request', authentication, adminPermission, AdminSystemConfigurationController.disableCourseRequest);

module.exports = adminRouter;