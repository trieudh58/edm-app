var express = require('express');
var router = express.Router();
var NotificationController = require('../controllers/notifications');
var authentication = require('../middleware/authentication');
var adminPermission = require('../middleware/adminPermission');

/* Create a notification (admin permission required) */
router.post('/create', authentication, adminPermission, NotificationController.createNew);

/* Send a created notification */
router.put('/send-created', authentication, adminPermission, NotificationController.sendCreated);

/* Get all notification created (admin permission required) */
router.get('/get-all', authentication, adminPermission, NotificationController.getAll);

/* Get a specific notification by id (admin permission required) */
router.get('/get-one-by-id', authentication, adminPermission, NotificationController.getOneById);

/* Delete one notification by id (admin permission required) */
router.delete('/delete-one-by-id', authentication, adminPermission, NotificationController.deleteOneById);

module.exports = router;