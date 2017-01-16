var express = require('express');
var adminRouter = express.Router();
var AdminFeedbackController = require('../../controllers/admin/feedbacks');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

/* Admins read all feedbacks */
adminRouter.get('/read-all', authentication, adminPermission, AdminFeedbackController.readAllFeedbacks);

module.exports = adminRouter;