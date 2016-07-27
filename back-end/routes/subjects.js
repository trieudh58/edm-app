var express = require('express');
var router = express.Router();
var Subjects = require('../controllers/subjects');
var authentication = require('../middleware/authentication');
var adminPermission = require('../middleware/adminPermission');

/* Get subjects' names and credits */
router.get('/get-names-and-credits', authentication, Subjects.getNamesAndCredits);

/* Get subject's information */
router.get('/get-info', authentication, Subjects.getInfo);

/* Add subject name and credit */
router.post('/create-subject', authentication, adminPermission, Subjects.createSubject);

/* Delete a subject */
router.delete('/delete-subject', authentication, adminPermission, Subjects.deleteSubject);

module.exports = router;