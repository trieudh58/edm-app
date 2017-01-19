var express = require('express');
var adminRouter = express.Router();
var AdminSystemConfigurationController = require('../../controllers/admin/systemConfigurations');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

/* Admins read all system configurations */
adminRouter.get('/get-all', authentication, adminPermission, AdminSystemConfigurationController.getAll);

/* Admins reset all system configurations to default */
adminRouter.post('/reset', authentication, adminPermission, AdminSystemConfigurationController.reset);

module.exports = adminRouter;