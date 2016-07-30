var express = require('express');
var router = express.Router();
var NotificationController = require('../controllers/notifications');
var authentication = require('../middleware/authentication');
var adminPermission = require('../middleware/adminPermission');

/* Create a notification (admin permission required) */
router.post('/create', authentication, adminPermission, NotificationController.create);

/* Get all notification created (admin permission required) */
router.get('/get-all', authentication, adminPermission, NotificationController.getAll);

module.exports = router;