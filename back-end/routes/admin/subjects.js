var express = require('express');
var router = express.Router();
var SubjectController = require('../../controllers/subjects');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

/* Add subject name and credit */
router.post('/create-subject', authentication, adminPermission, SubjectController.createSubject);

/* Delete a subject */
router.delete('/delete-subject', authentication, adminPermission, SubjectController.deleteSubject);

module.exports = router;