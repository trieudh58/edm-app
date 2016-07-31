var express = require('express');
var router = express.Router();

/* User-related routes */
router.use('/users', require('./users'));

/* StudentRecord-related routes */
router.use('/student-records', require('./studentRecords'));

/* Subject-related routes */
router.use('/subjects', require('./subjects'));

/* Notification-related routes */
router.use('/notifications', require('./notifications'));

module.exports = router;