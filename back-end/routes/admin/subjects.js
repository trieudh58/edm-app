var express = require('express');
var adminRouter = express.Router();
var SubjectController = require('../../controllers/subjects');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

/* Add subject name and credit */
adminRouter.post('/create-subject', authentication, adminPermission, SubjectController.createSubject);

/* Delete a subject */
adminRouter.delete('/delete-subject', authentication, adminPermission, SubjectController.deleteSubject);

module.exports = adminRouter;