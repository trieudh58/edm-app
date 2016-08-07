var express = require('express');
var adminRouter = express.Router();
var AdminNotificationController = require('../../controllers/admin/notifications');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

/* Create a notification */
adminRouter.post('/create', authentication, adminPermission, AdminNotificationController.createNew);

/* Send a created notification */
adminRouter.put('/send-created', authentication, adminPermission, AdminNotificationController.sendCreated);

/* Create and send notification */
adminRouter.post('/create-and-send', authentication, adminPermission, AdminNotificationController.createAndSend);

/* Get all notification created */
adminRouter.get('/get-all', authentication, adminPermission, AdminNotificationController.getAll);

/* Get all sent notification */
adminRouter.get('/get-all-sent', authentication, adminPermission, AdminNotificationController.getAllSent);

/* Get a specific notification by id */
adminRouter.get('/get-one-by-id', authentication, adminPermission, AdminNotificationController.getOneById);

/* Delete one notification by id */
adminRouter.delete('/delete-one-by-id', authentication, adminPermission, AdminNotificationController.deleteOneById);

module.exports = adminRouter;