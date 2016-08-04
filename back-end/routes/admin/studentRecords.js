var express = require('express');
var adminRouter = express.Router();
var AdminStudentRecordController = require('../../controllers/admin/studentRecords');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

module.exports = adminRouter;