var express = require('express');
var router = express.Router();
var SubjectController = require('../controllers/subjects');
var authentication = require('../middleware/authentication');
var adminPermission = require('../middleware/adminPermission');

/* Get SubjectController' names and credits */
router.get('/get-names-and-credits', authentication, SubjectController.getNamesAndCredits);

/* Get subject's information */
router.get('/get-info', authentication, SubjectController.getInfo);

/* Add subject name and credit */
router.post('/create-subject', authentication, adminPermission, SubjectController.createSubject);

/* Delete a subject */
router.delete('/delete-subject', authentication, adminPermission, SubjectController.deleteSubject);

module.exports = router;