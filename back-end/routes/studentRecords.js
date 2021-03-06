var express = require('express');
var router = express.Router();
var StudentRecordController = require('../controllers/studentRecords');
var authentication = require('../middleware/authentication');

/* Get record of a student */
router.get('/get', authentication, StudentRecordController.get);

module.exports = router;