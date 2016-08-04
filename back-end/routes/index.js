var express = require('express');
var router = express.Router();

/*
 * Normal routes (for common users or free access)
 * ----------
 * ----------
 * ----------
 * */

/* User-related routes */
router.use('/users', require('./users'));

/* StudentRecord-related routes */
router.use('/student-records', require('./studentRecords'));

/* Subject-related routes */
router.use('/subjects', require('./subjects'));


/*
* Admin permission required routes
* ----------
* ----------
* ----------
* */
router.use('/admin', require('./admin'));

module.exports = router;