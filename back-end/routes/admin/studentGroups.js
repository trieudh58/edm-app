var express = require('express');
var adminRouter = express.Router();
var StudentGroupController = require('../../controllers/admin/studentGroups');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');
var validation = require('../../validation/admin/studentGroups');

/* Get all groups */
adminRouter.get('/get-all', authentication, adminPermission, StudentGroupController.getAll);

/* Create new group */
adminRouter.post('/create', validation.create, authentication, adminPermission, StudentGroupController.create);

/* Delete a group by id */
adminRouter.delete('/delete-by-id', validation.deleteById, authentication, adminPermission, StudentGroupController.deleteById);

/* Delete a group by name */
adminRouter.delete('/delete-by-name', validation.deleteByName, authentication, adminPermission, StudentGroupController.deleteByName);

module.exports = adminRouter;