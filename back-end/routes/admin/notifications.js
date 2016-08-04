var express = require('express');
var router = express.Router();
var AdminNotificationController = require('../../controllers/admin/notifications');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

/* Create a notification (admin permission required) */
router.post('/create', authentication, adminPermission, AdminNotificationController.createNew);

/* Send a created notification */
router.put('/send-created', authentication, adminPermission, AdminNotificationController.sendCreated);

/* Get all notification created (admin permission required) */
router.get('/get-all', authentication, adminPermission, AdminNotificationController.getAll);

/* Get a specific notification by id (admin permission required) */
router.get('/get-one-by-id', authentication, adminPermission, AdminNotificationController.getOneById);

/* Delete one notification by id (admin permission required) */
router.delete('/delete-one-by-id', authentication, adminPermission, AdminNotificationController.deleteOneById);

module.exports = router;