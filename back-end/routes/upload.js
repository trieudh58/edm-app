var express = require('express');
var multer = require('multer');
var router = express.Router();
var upload = require('../controllers/upload');
var authentication = require('../middleware/authentication');

var imageUpload = multer({
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

var fileUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, __dirname + '/../public/files/');
    },
    filename: function (req, file, callback) {
      var fileType = file.mimetype.split('/')[1];
      callback(null, file.fieldname + '-' + Date.now() + '.' + fileType);
    }
  })
});
/* upload image get link*/
router.post('/upload-image', authentication, imageUpload.single('image'), upload.uploadImage);

/* upload file get link */
router.post('/upload-file', authentication, fileUpload.single('file'), upload.uploadFile);


module.exports = router;