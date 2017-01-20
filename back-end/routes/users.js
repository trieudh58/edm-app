var express = require('express');
var multer = require('multer');
var router = express.Router();
var UserController = require('../controllers/users');
var authentication = require('../middleware/authentication');
var validation = require('../validation/users');

var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, __dirname + '/../public/images/');
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

/* Upload avatar of a user */
// Need to be enhanced with validation layer of image checking type and size"
router.post('/upload-avatar', authentication, upload.single('avatar'), UserController.uploadAvatar);

/* Authenticate a user */
router.post('/authenticate', validation.authenticate, UserController.authenticate);

/* Get data of current user */
router.get('/get', authentication, UserController.get);

/* Register new account */
router.post('/register', validation.register, UserController.register);

/* Verify email with remember token */
router.put('/verify-email', validation.verifyEmail, UserController.verifyEmail);

/* Change password */
router.put('/change-password', validation.changePassoword, authentication, UserController.changePassword);

/* Update interests */
router.put('/update-interests', validation.updateInterests, authentication, UserController.updateInterests);

/* Update skills */
router.put('/update-skills', validation.updateSkills, authentication, UserController.updateSkills);

module.exports = router;