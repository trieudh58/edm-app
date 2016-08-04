var express = require('express');
var router = express.Router();
var AdminStudentRecordController = require('../../controllers/admin/studentRecords');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

module.exports = router;