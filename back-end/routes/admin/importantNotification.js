var express = require('express');
var adminRouter = express.Router();
var multer = require('multer');
var AdminPostController = require('../../controllers/admin/importantNotification');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');
// var validation = require('../../validation/admin/importantNotification');

/* Admins get all posts */
adminRouter.get('/get-all', authentication, adminPermission, AdminPostController.getAll);

/* Admins get all published posts */
adminRouter.get('/get-all-published', authentication, adminPermission, AdminPostController.getAllPublished);

/* Admins get all unpublished posts */
adminRouter.get('/get-all-unpublished', authentication, adminPermission, AdminPostController.getAllUnpublished);

/* Admins create a post */
adminRouter.post('/create', authentication, adminPermission, AdminPostController.create);

/* Admins create and published a post */
adminRouter.post('/create-and-publish', authentication, adminPermission,AdminPostController.createAndPublish);

/* Admins edit a post header */
adminRouter.put('/update-header', authentication, adminPermission, AdminPostController.updatePostHeader);

/* Admins edit a post body */
adminRouter.put('/update-body', authentication, adminPermission, AdminPostController.updatePostBody);

/* Admins publish a post */
adminRouter.put('/publish-one', authentication, adminPermission, AdminPostController.publishOne);

/* Admins unpublish a post */
adminRouter.put('/unpublish-one', authentication, adminPermission, AdminPostController.unpublishOne);

/* Admins publish all post */
adminRouter.put('/publish-all', authentication, adminPermission, AdminPostController.publishAll);

/* Admins unpublish all post */
adminRouter.put('/unpublish-all', authentication, adminPermission, AdminPostController.unpublishAll);

/* Admins delete a post */
adminRouter.delete('/delete', authentication, adminPermission, AdminPostController.delete);

module.exports = adminRouter;