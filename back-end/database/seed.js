var seeder = require('mongoose-seed');
var config = require('../config/index');
var bcrypt = require('bcrypt');
var csv = require('fast-csv');
var fs = require('fs');
var models = require('../models');
var async = require('async');

seeder.connect(config.mongodb.host, function () {
   /* Load mongoose models*/
    seeder.loadModels([
        'models/User.js',
        'models/Subject.js',
        'models/StudentRecord.js'
    ]);
    /* Clear models' data */
    seeder.clearModels([
        'User',
        'Subject',
        'StudentRecord'
    ], function () {
        seeder.populateModels(data);

        /* Import data from csv files */
        var stream = fs.createReadStream(__dirname + '/raw/out_Students_2012.csv');
        var studentRecords = [];
        var csvStream = csv.parse({delimiter: ','}).on('data', function (data) {
            studentRecords.push(data);
        }).on('finish', function () {
            // Create user
            var createUser = function (studentRecords, callback) {
                console.log('Creating users....');
                for (var i = 1; i < studentRecords.length; i++) {
                    // Parse String to Date type
                    var DOB = studentRecords[i][2].split('/');
                    var date = new Date(parseInt(DOB[2]), parseInt(DOB[1]) - 1, parseInt(DOB[0].substring(1)), 0, 0, 1);
                    models.User.create({
                        email: studentRecords[i][0] + '@vnu.edu.vn',
                        password: bcrypt.hashSync('123456', 1),
                        studentCode: parseInt(studentRecords[i][0]),
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
                callback(null, studentRecords);
            };
            // Create student record
            var createStudentRecord = function (studentRecords, callback) {
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
                callback(null, studentRecords);
            };
            // Update scores to studentRecords (must run after studentRecord is created)
            var updateScore = function (studentRecords, callback) {
                console.log('Updating scores...');
                for (var i = 1; i < studentRecords.length; i++) {
                    for (var j = 4; j < studentRecords[i].length; j++) {
                        var normalizedScore = '';
                        if (studentRecords[i][j] == '' || studentRecords[i][j] == ' ' || isNaN(parseFloat(studentRecords[i][j]))) {
                            normalizedScore = '?';
                        }
                        else {
                            normalizedScore = studentRecords[i][j];
                        }
                        models.StudentRecord.update({
                            studentCode: studentRecords[i][0]
                        }, {
                            $push: {
                                record: {
                                    subjectCode: studentRecords[0][j],
                                    score: normalizedScore
                                }
                            }
                        }, {
                            safe: true,
                            // Insert new instance if it does not exist
                            upsert: true
                        }, function (err, updatedRecord) {
                            if (err) {
                                throw err;
                            }
                        });
                    }
                }
                callback(null, studentRecords);
            };

            // Asynchronous queue
            var queue = [
                function (callback) {
                    callback(null, studentRecords);
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
        stream.pipe(csvStream);
    });
});

/* Data to be populated */
var data = [
    {
        model: 'User',
        documents: [
            {
                email: 'admin@gmail.com',
                password: bcrypt.hashSync('123456', config.bcrypt.saltRounds),
                isAdmin: true
            }
        ]
    }
];

module.exports = seeder;
