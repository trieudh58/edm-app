var express = require('express');
var router = express.Router();
var TimeTableController = require('../controllers/timeTables');
var authentication = require('../middleware/authentication');
var validation = require('../validation/timeTables');

/* Get school time table */
router.get('/get-school-time-table', authentication, TimeTableController.getSchoolTimeTable);

/* Create time table */
router.post('/create-personal-time-table', validation.createPersonalTimeTable, authentication, TimeTableController.createPersonalTimeTable);

/* Get personal time table */
router.get('/get-personal-time-table', authentication, TimeTableController.getPersonalTimeTable);

module.exports = router;