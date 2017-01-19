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

module.exports = adminRouter;