var express = require('express');
var adminRouter = express.Router();

/* Admin permission required routes */

adminRouter.use('/notifications', require('./notifications'));

adminRouter.use('/student-records', require('./studentRecords'));

adminRouter.use('/users', require('./users'));

adminRouter.use('/subjects', require('./subjects'));

module.exports = adminRouter;