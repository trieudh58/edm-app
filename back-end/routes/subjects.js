var express = require('express');
var router = express.Router();
var Subjects = require('../controllers/subjects');
var authentication = require('../middleware/authentication');
var adminPermission = require('../middleware/adminPermission');

/* Get subjects' names */
router.get('/get-names', authentication, Subjects.getName);

/* Get subject's information */
router.get('/get-info', authentication, Subjects.getInfo);

module.exports = router;