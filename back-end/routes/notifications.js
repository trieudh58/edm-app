var express = require('express');
var router = express.Router();
var NotificationController = require('../controllers/notifications');
var authentication = require('../middleware/authentication');

/* Get notifications owned by current (request) user */
router.get('/get-owned-notification-titles', authentication, NotificationController.getOwnedNotificationTitles);

module.exports = router;