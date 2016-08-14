var express = require('express');
var router = express.Router();
var fs = require('fs');

/* Require (Import) file in alternative way */
fs.readdir(__dirname, function (err, files) {
    for (var i = 0; i < files.length; i++) {
        if (files[i] != 'index.js') {
            var parsedByUpperCase = files[i].split(/(?=[A-Z])/); // 'courseRequest.js' => ['course', 'Requests.js']
            var url = '/';
            if (parsedByUpperCase.length > 1) {
                for (var j = 0; j < parsedByUpperCase.length; j++) {
                    if (j != parsedByUpperCase.length - 1) {
                        url += parsedByUpperCase[j].toLowerCase() + '-';
                    }
                    else {
                        url += parsedByUpperCase[j].toLowerCase();
                    }
                }
                url = url.split('.')[0];
            }
            else {
                url += parsedByUpperCase[0].split('.')[0];
            }
            router.use(url, require('./' + files[i]));
        }
    }
});

///*
// * Normal routes (for common users or free access)
// * ----------
// * ----------
// * ----------
// * */
//
///* User-related routes */
//router.use('/users', require('./users'));
//
///* StudentRecord-related routes */
//router.use('/student-records', require('./studentRecords'));
//
///* Subject-related routes */
//router.use('/subjects', require('./subjects'));
//
///* Notification-related routes */
//router.use('/notifications', require('./notifications'));
//
///* CourseRequest-related routes */
//router.use('/course-requests', require('./courseRequests'));
//
///*
//* Admin permission required routes
//* ----------
//* ----------
//* ----------
//* */
//router.use('/admin', require('./admin'));

module.exports = router;