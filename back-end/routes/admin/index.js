var express = require('express');
var adminRouter = express.Router();
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
            adminRouter.use(url, require('./' + files[i]));
        }
    }
});

///* Admin permission required routes */
//
//adminRouter.use('/notifications', require('./notifications'));
//
//adminRouter.use('/student-records', require('./studentRecords'));
//
//adminRouter.use('/users', require('./users'));
//
//adminRouter.use('/subjects', require('./subjects'));
//
//adminRouter.use('/student-groups', require('./studentGroups'));
//
//adminRouter.use('/course-requests', require('./courseRequests'));

module.exports = adminRouter;