var express = require('express');
var adminRouter = express.Router();
var AdminUserController = require('../../controllers/admin/users');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');
var validation = require('../../validation/admin/users');

/* Create a user */
adminRouter.post('/create', validation.create, authentication, adminPermission, AdminUserController.create);

/* Activate a user */
adminRouter.put('/activate-user', validation.activateUser, authentication, adminPermission, AdminUserController.activateUser);

/* Deactivate a user */
adminRouter.put('/deactivate-user', validation.deactivateUser, authentication, adminPermission, AdminUserController.deactivateUser);

/* Delete a user. Admin permission required */
adminRouter.delete('/delete', validation.delete, authentication, adminPermission, AdminUserController.delete);

/* Update name of a user */
adminRouter.put('/update-name', validation.updateName, authentication, adminPermission, AdminUserController.updateName);

/* Find a user by student code */
adminRouter.get('/find-by-student-code', validation.findByStudentCode, authentication, adminPermission, AdminUserController.findByStudentCode);

/* Find a user by name */
adminRouter.get('/find-by-name', validation.findByName, authentication, adminPermission, AdminUserController.findByName);

/* Find a user by email */
adminRouter.get('/find-by-email', validation.findByEmail, authentication, adminPermission, AdminUserController.findByEmail);

module.exports = adminRouter;