var express = require('express');
var adminRouter = express.Router();
var AdminPostController = require('../../controllers/admin/posts');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');
var validation = require('../../validation/admin/posts');


/* Admins get all posts */
adminRouter.get('/get-all', authentication, adminPermission, AdminPostController.getAll);

/* Admins get all published posts */
adminRouter.get('/get-all-published', authentication, adminPermission, AdminPostController.getAllPublished);

/* Admins get all unpublished posts */
adminRouter.get('/get-all-unpublished', authentication, adminPermission, AdminPostController.getAllUnpublished);

/* Admins create a post */
adminRouter.post('/create', validation.create, authentication, adminPermission, AdminPostController.create);

/* Admins edit a post header */
adminRouter.put('/update-header', validation.updatePostHeader, authentication, adminPermission, AdminPostController.updatePostHeader);

/* Admins edit a post body */
adminRouter.put('/update-body', validation.updatePostBody, authentication, adminPermission, AdminPostController.updatePostBody);

/* Admins publish a post */
adminRouter.put('/publish-one', validation.publishOne, authentication, adminPermission, AdminPostController.publishOne);

/* Admins unpublish a post */
adminRouter.put('/unpublish-one', validation.unpublishOne, authentication, adminPermission, AdminPostController.unpublishOne);

/* Admins delete a post */
adminRouter.delete('/delete', validation.delete, authentication, adminPermission, AdminPostController.delete);

module.exports = adminRouter;