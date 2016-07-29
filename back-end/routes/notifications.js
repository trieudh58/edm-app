var express = require('express');
var router = express.Router();
var NotificationController = require('../controllers/notifications');
var authentication = require('../middleware/authentication');
var adminPermission = require('../middleware/adminPermission');

router.post('/create', authentication, adminPermission, NotificationController.create);

module.exports = router;