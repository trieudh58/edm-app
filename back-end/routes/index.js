var express = require('express');
var router = express.Router();

/* User-related routes */
router.use('/users', require('./users'));

/* StudentRecord-related routes */
router.use('/student-records', require('./studentRecords'));

module.exports = router;