var express = require('express');
var router = express.Router();
var SubjectController = require('../controllers/subjects');
var authentication = require('../middleware/authentication');

/* Get SubjectController' names and credits */
router.get('/get-names-and-credits', authentication, SubjectController.getNamesAndCredits);

/* Get subject's information */
router.get('/get-info', authentication, SubjectController.getInfo);

module.exports = router;