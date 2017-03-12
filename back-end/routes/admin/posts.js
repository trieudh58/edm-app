var express = require('express');
var adminRouter = express.Router();
var multer = require('multer');
var AdminPostController = require('../../controllers/admin/posts');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');
var validation = require('../../validation/admin/posts');

var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, __dirname + '/../../public/images/');
    },
    filename: function (req, file, callback) {
      var fileType = file.mimetype.split('/')[1];
      callback(null, file.fieldname + '-' + Date.now() + '.' + fileType);
    }
  }),
  // File filter. We need to filter out non-image file type
  fileFilter: function (req, file, callback) {
    // Accept .png and .jpg
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      callback(null, true);
    }
    else {
      callback(null, false);
    }
  }
});
/* Admins get all posts */
adminRouter.get('/get-all', authentication, adminPermission, AdminPostController.getAll);

/* Admins get all published posts */
adminRouter.get('/get-all-published', authentication, adminPermission, AdminPostController.getAllPublished);

/* Admins get all unpublished posts */
adminRouter.get('/get-all-unpublished', authentication, adminPermission, AdminPostController.getAllUnpublished);

/* Admins create a post */
adminRouter.post('/create', authentication, adminPermission, upload.single('coverImage'), AdminPostController.create);

/* Admins create and published a post */
adminRouter.post('/create-and-publish', authentication, adminPermission,  upload.single('coverImage'),AdminPostController.createAndPublish);

/* Admins edit a post header */
adminRouter.put('/update-header', validation.updatePostHeader, authentication, adminPermission, AdminPostController.updatePostHeader);

/* Admins edit a post body */
adminRouter.put('/update-body', validation.updatePostBody, authentication, adminPermission, AdminPostController.updatePostBody);

/* Admins publish a post */
adminRouter.put('/publish-one', validation.publishOne, authentication, adminPermission, AdminPostController.publishOne);

/* Admins unpublish a post */
adminRouter.put('/unpublish-one', validation.unpublishOne, authentication, adminPermission, AdminPostController.unpublishOne);

/* Admins publish all post */
adminRouter.put('/publish-all', authentication, adminPermission, AdminPostController.publishAll);

/* Admins unpublish all post */
adminRouter.put('/unpublish-all', authentication, adminPermission, AdminPostController.unpublishAll);

/* Admins delete a post */
adminRouter.delete('/delete', validation.delete, authentication, adminPermission, AdminPostController.delete);

module.exports = adminRouter;