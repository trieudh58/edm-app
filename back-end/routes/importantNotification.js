var express = require('express');
var router = express.Router();
var notificationController = require('../controllers/importantNotification');
var authentication = require('../middleware/authentication');
var validation = require('../validation/posts');

/* Get all posts */
router.get('/get-all', authentication, notificationController.getAll);

/* Get all post headers */
router.get('/get-all-headers', authentication, notificationController.getAllNotificationHeaders);

/* Get one post by id */
router.get('/get-one-by-id', authentication, notificationController.getOneById);

module.exports = router;