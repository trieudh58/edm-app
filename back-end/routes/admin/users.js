var express = require('express');
var adminRouter = express.Router();
var AdminUserController = require('../../controllers/admin/users');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

/* Create a user */
adminRouter.post('/create', authentication, adminPermission, AdminUserController.create);

/* Delete a user. Admin permission required */
adminRouter.delete('/delete', authentication, adminPermission, AdminUserController.delete);

module.exports = adminRouter;