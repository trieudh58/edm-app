var express = require('express');
var adminRouter = express.Router();
var UserController = require('../../controllers/users');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

/* Create a user */
adminRouter.post('/create', authentication, adminPermission, UserController.create);

/* Delete a user. Admin permission required */
adminRouter.delete('/delete', authentication, adminPermission, UserController.delete);

module.exports = adminRouter;