var express = require('express');
var router = express.Router();
var TimeTableController = require('../controllers/timeTables');
var authentication = require('../middleware/authentication');
var validation = require('../validation/timeTables');

/* Get time table */
router.get('/get-school-time-table', authentication, TimeTableController.getSchoolTimeTable);

/* Create time table */
router.post('/create-personal-time-table', validation.createPersonalTimeTable, authentication, TimeTableController.createPersonalTimeTable);

module.exports = router;