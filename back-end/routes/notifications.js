var express = require('express');
var router = express.Router();
var NotificationController = require('../controllers/notifications');
var authentication = require('../middleware/authentication');

/* Get notification title owned by current (request) user */
router.get('/get-titles', authentication, NotificationController.getTitles);

/* Get specific notification by id */
router.get('/get-by-id', authentication, NotificationController.getById);

/* Get 5 latest notification titles */
router.get('/get-5-latest-titles', authentication, NotificationController.get5Latest);

/* Mark all notifications as read */
router.put('/mark-all-as-read', authentication, NotificationController.markAllAsRead);

/* Mark one notification as read */
router.put('/mark-one-as-read', authentication, NotificationController.markOneAsRead);

module.exports = router;