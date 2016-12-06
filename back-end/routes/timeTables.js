var express = require('express');
var router = express.Router();
var TimeTableController = require('../controllers/timeTables');
var authentication = require('../middleware/authentication');

/* Get time table */
router.get('/get-school-time-table', authentication, TimeTableController.getSchoolTimeTable);

module.exports = router;