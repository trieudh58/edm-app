var express = require('express');
var adminRouter = express.Router();
var AdminSubjectController = require('../../controllers/admin/subjects');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

/* Get AdminSubjectController' names and credits */
adminRouter.get('/get-names-and-credits', authentication, adminPermission, AdminSubjectController.getNamesAndCredits);

/* Get subject's information */
adminRouter.get('/get-info', authentication,adminPermission, AdminSubjectController.getInfo);

/* Add subject name and credit */
adminRouter.post('/create-subject', authentication, adminPermission, AdminSubjectController.createSubject);

/* Delete a subject */
adminRouter.delete('/delete-subject', authentication, adminPermission, AdminSubjectController.deleteSubject);

module.exports = adminRouter;