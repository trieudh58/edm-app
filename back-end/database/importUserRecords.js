var csv = require('fast-csv');
var fs = require('fs');
var models = require('../models');
var async = require('async');
var bcrypt = require('bcrypt');

//var scoreStream = fs.createReadStream(__dirname + '/raw/devMode_out_Students_2012.csv');
var scoreStream = fs.createReadStream(__dirname + '/raw/devMode_out_DIEM.csv');
var studentRecords = [];
var csvScoreStream = csv.parse({delimiter: ';'}).on('data', function (data) {
    studentRecords.push(data);
}).on('finish', function () {
    //var whenStream = fs.createReadStream(__dirname + '/raw/devMode_out_Students_When.csv');
    var whenStream = fs.createReadStream(__dirname + '/raw/devMode_out_TIME.csv');
    var whenRecords = [];
    var csvWhenRecord = csv.parse({delimiter: ';'}).on('data', function (data) {
        whenRecords.push(data);
    }).on('finish', function () {
        // Create user
        var createUser = function (studentRecords, whenRecords, callback) {
            console.log('Creating users....');
            models.StudentGroup.find({}, '-__v', function (err, groups) {
                if (err) {
                    throw err;
                }
                for (var i = 1; i < studentRecords.length; i++) {
                    // Parse String to Date type
                    var DOB = studentRecords[i][4].split('/');
                    var date = new Date(parseInt(DOB[2]), parseInt(DOB[1]) - 1, parseInt(DOB[0]), 0, 0, 1);

                    var studentGroups = [];
                    var startYear = (studentRecords[i][0].length == 7) ? parseInt(studentRecords[i][0].slice(0,1)) : parseInt(studentRecords[i][0].slice(0,2));
                    var groupBySchoolYear = '';
                    if (!isNaN(startYear)) {
                        groupBySchoolYear = 'K' + (45 + startYear).toString();
                        for (var j = 0; j < groups.length; j++) {
                            if (groups[j].name == groupBySchoolYear || groups[j].name == 'All') {
                                studentGroups.push({group: groups[j]._id});
                            }
                        }
                    }
                    else if (studentRecords[i][0].indexOf('_') != -1) {
                        groupBySchoolYear = 'K' + studentRecords[i][0].split('_')[1];
                        for (var j = 0; j < groups.length; j++) {
                            if (groups[j].name == groupBySchoolYear || groups[j].name == 'All') {
                                studentGroups.push({group: groups[j]._id});
                            }
                        }
                    }

                    models.User.create({
                        email: studentRecords[i][0] + '@gmail.com',
                        password: bcrypt.hashSync('123456', 1),
                        studentCode: studentRecords[i][0],
                        personalInfo: {
                            fullName: studentRecords[i][1],
                            gender: studentRecords[i][3],
                            DOB: date,
                            className: studentRecords[i][2],
                            groups: studentGroups
                        },
                        isActive: false
                    }, function (err, user) {
                        if (err) {
                            throw err;
                        }
                    });
                }
            });
            callback(null, studentRecords, whenRecords);
        };
        // Create student record
        var createStudentRecord = function (studentRecords, whenRecords, callback) {
            console.log('Creating student records...');
            for (var i = 1; i < studentRecords.length; i++) {
                models.StudentRecord.create({
                    studentCode: studentRecords[i][0]
                }, function (err, record) {
                    if (err) {
                        throw err;
                    }
                });
            }
            callback(null, studentRecords, whenRecords);
        };
        // Update scores to studentRecords (must run after studentRecord is created)
        var updateScore = function (studentRecords, whenRecords, callback) {
            console.log('Updating scores...');
            for (var i = 1; i < studentRecords.length; i++) {
                for (var j = 5; j < studentRecords[i].length; j++) {
                    var normalizedScoreString = '';
                    var scoreArray = [];
                    var normalizedWhenString = '';
                    var whenArray = [];

                    // Normalize score string: replace special characters from string
                    if (studentRecords[i][j] == '' || studentRecords[i][j] == ' ' || isNaN(parseFloat(studentRecords[i][j]))) {
                        normalizedScoreString = '?';
                    }
                    else {
                        normalizedScoreString = studentRecords[i][j];
                        // Split string into single scores
                        scoreArray = normalizedScoreString.split('-');
                    }

                    // Normalize semester (when) time string: replace special characters from string
                    if (whenRecords[i][j] == '' || whenRecords[i][j] == ' ') {
                        normalizedWhenString = '?';
                    }
                    else {
                        normalizedWhenString = whenRecords[i][j];
                        if (typeof normalizedWhenString == 'undefined') {
                            normalizedWhenString = '';
                        }
                        var splittedArray = normalizedWhenString.split('-');
                        if (splittedArray.length == 1) {
                            whenArray.push(normalizedWhenString);
                        }
                        else {
                            for (var k = 0; k < splittedArray.length - 1; k++) {
                                if (splittedArray[k].indexOf('.') >= 0) {
                                    whenArray.push(splittedArray[k].concat('-' + splittedArray[k+1]));
                                }
                            }
                        }
                    }
                    var computeAttempt = function (whenArray, scoreArray, studentRecords, i, j, callback) {
                        var attempt = [];
                        for (var m = 0; m < whenArray.length; m++) {
                            attempt.push({
                                score: scoreArray[m],
                                semester: whenArray[m]
                            });
                        }
                        callback(null, attempt, studentRecords, i, j);
                    };
                    var pushToRecord = function (attempt, studentRecords, i, j, callback) {
                        if (attempt.length) {
                            var record = {
                                subjectCode: studentRecords[0][j],
                                attempt: attempt
                            };
                            models.StudentRecord.update({
                                studentCode: studentRecords[i][0]
                            }, {
                                $push: {
                                    record: record
                                }
                            }, function (err, sr) {
                                if (err) {
                                    throw err;
                                }
                                else {
                                }
                            });
                        }
                        callback(null, 'Done');
                    };
                    var initialFunction = function (whenArray, scoreArray, studentRecords, i, j, callback) {
                        callback(null, whenArray, scoreArray, studentRecords, i, j);
                    };

                    var queue = [];
                    queue.push(initialFunction.bind(null, whenArray, scoreArray, studentRecords, i, j));
                    queue.push(computeAttempt);
                    queue.push(pushToRecord);
                    async.waterfall(queue);
                }
            }
            callback(null, studentRecords, whenRecords);
        };
        // Synchronous queue
        var queue = [
            function (callback) {
                callback(null, studentRecords, whenRecords);
            }
        ];
        queue.push(createUser);
        queue.push(createStudentRecord);
        queue.push(updateScore);
        async.waterfall(queue, function (err) {
            if (!err) {
                console.log('Completed!');
            }
        });
    });
    whenStream.pipe(csvWhenRecord);
});
scoreStream.pipe(csvScoreStream);
