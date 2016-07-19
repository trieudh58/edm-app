var csv = require('fast-csv');
var fs = require('fs');
var models = require('../models');
var async = require('async');
var bcrypt = require('bcrypt');

var scoreStream = fs.createReadStream(__dirname + '/raw/out_Students_2012.csv');
var studentRecords = [];
var csvScoreStream = csv.parse({delimiter: ','}).on('data', function (data) {
    studentRecords.push(data);
}).on('finish', function () {
    var whenStream = fs.createReadStream(__dirname + '/raw/out_Students_When.csv');
    var whenRecords = [];
    var csvWhenRecord = csv.parse({delimiter: ','}).on('data', function (data) {
        whenRecords.push(data);
    }).on('finish', function () {
        // Create user
        var createUser = function (studentRecords, whenRecords, callback) {
            console.log('Creating users....');
            for (var i = 1; i < studentRecords.length; i++) {
                // Parse String to Date type
                var DOB = studentRecords[i][2].split('/');
                var date = new Date(parseInt(DOB[2]), parseInt(DOB[1]) - 1, parseInt(DOB[0].substring(1)), 0, 0, 1);
                models.User.create({
                    email: studentRecords[i][0] + '@vnu.edu.vn',
                    password: bcrypt.hashSync('123456', 1),
                    studentCode: studentRecords[i][0],
                    personalInfo: {
                        gender: studentRecords[i][3],
                        DOB: date,
                        className: studentRecords[i][1]
                    },
                    isActive: false
                }, function (err, user) {
                    if (err) {
                        throw err;
                    }
                });
            }
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
                for (var j = 4; j < studentRecords[i].length; j++) {
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
                    for (var l = 0; l < scoreArray.length; l++) {
                        models.StudentRecord.update({
                            studentCode: studentRecords[i][0]
                        }, {
                            $push: {
                                record: {
                                    subjectCode: studentRecords[0][j],
                                    attempt: {
                                        score: scoreArray[l],
                                        semester: whenArray[l]
                                    }
                                }
                            }
                        }, {
                            safe: true,
                            // Insert new instance if it does not exist
                            upsert: false
                        }, function (err, updatedRecord) {
                            if (err) {
                                throw err;
                            }
                        });
                    }
                }
            }
            callback(null, studentRecords, whenRecords);
        };
        // Asynchronous queue
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
                console.log('Finish!');
            }
        });
    });
    whenStream.pipe(csvWhenRecord);
});
scoreStream.pipe(csvScoreStream);