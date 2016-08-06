var express = require('express');
var adminRouter = express.Router();
var StudentGroupController = require('../../controllers/admin/studentGroups');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

/* Get all groups */
adminRouter.get('/get-all', authentication, adminPermission, StudentGroupController.getAll);

/* Create new group */
adminRouter.post('/create', authentication, adminPermission, StudentGroupController.create);

/* Delete a group */
adminRouter.delete('/delete-by-id', authentication, adminPermission, StudentGroupController.deleteById);

module.exports = adminRouter;