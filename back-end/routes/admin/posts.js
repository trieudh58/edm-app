var express = require('express');
var adminRouter = express.Router();
var AdminPostController = require('../../controllers/admin/posts');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');
var validation = require('../../validation/admin/posts');

/* Admins create a post */
adminRouter.post('/create', validation.create, authentication, adminPermission, AdminPostController.create);

/* Admins edit a post header */
adminRouter.put('/update-header', validation.updatePostHeader, authentication, adminPermission, AdminPostController.updatePostHeader);

/* Admins edit a post body */
adminRouter.put('/update-body', validation.updatePostBody, authentication, adminPermission, AdminPostController.updatePostBody);

module.exports = adminRouter;