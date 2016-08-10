var express = require('express');
var adminRouter = express.Router();
var AdminUserController = require('../../controllers/admin/users');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

/* Create a user */
adminRouter.post('/create', authentication, adminPermission, AdminUserController.create);

/* Activate a user */
adminRouter.put('/activate-user', authentication, adminPermission, AdminUserController.activateUser);

/* Deactivate a user */
adminRouter.put('/deactivate-user', authentication, adminPermission, AdminUserController.deactivateUser);

/* Delete a user. Admin permission required */
adminRouter.delete('/delete', authentication, adminPermission, AdminUserController.delete);

module.exports = adminRouter;