var express = require('express');
var adminRouter = express.Router();
var AdminNotificationController = require('../../controllers/admin/notifications');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');
var validation = require('../../validation/admin/notifications');

/* Create a notification */
adminRouter.post('/create', validation.createNew, authentication, adminPermission, AdminNotificationController.createNew);

/* Send a created notification */
adminRouter.put('/send-created', validation.sendCreated, authentication, adminPermission, AdminNotificationController.sendCreated);

/* Create and send notification */
adminRouter.post('/create-and-send', validation.createAndSend, authentication, adminPermission, AdminNotificationController.createAndSend);

/* Get all notification created */
adminRouter.get('/get-all', authentication, adminPermission, AdminNotificationController.getAll);

/* Get all sent notification */
adminRouter.get('/get-all-sent', authentication, adminPermission, AdminNotificationController.getAllSent);

/* Get all unsent notification */
adminRouter.get('/get-all-unsent', authentication, adminPermission, AdminNotificationController.getAllUnsent);

/* Get a specific notification by id */
adminRouter.get('/get-one-by-id', validation.getOneById, authentication, adminPermission, AdminNotificationController.getOneById);

/* Delete one notification by id */
adminRouter.delete('/delete-one-by-id', validation.deleteOneById, authentication, adminPermission, AdminNotificationController.deleteOneById);

/* Delete one/many notifications by id */
adminRouter.delete('/delete-by-ids', validation.deleteByIds, authentication, adminPermission, AdminNotificationController.deleteByIds);

module.exports = adminRouter;