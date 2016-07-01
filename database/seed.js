var seeder = require('mongoose-seed');
var config = require('../config');
var bcrypt = require('bcrypt');
var csv = require('fast-csv');
var fs = require('fs');
var models = require('../models');

seeder.connect(config.mongodb.host, function () {
   /* Load mongoose models*/
    seeder.loadModels([
        'models/User.js',
        'models/Subject.js'
    ]);
    /* Clear models' data */
    seeder.clearModels([
        'User',
        'Subject'
    ], function () {
        seeder.populateModels(data);

        var stream = fs.createReadStream(__dirname + '/raw/out_Students_2012.csv');
        var studentRecords = [];
        var csvStream = csv.parse({delimiter: ','}).on('data', function (data) {
            studentRecords.push(data);
        }).on('finish', function () {
            for (var i = 1; i < studentRecords.length; i++) {
                // Parse String to Date type
                var DOB = studentRecords[i][2].split('/');
                var date = new Date(parseInt(DOB[2]), parseInt(DOB[1]) - 1, parseInt(DOB[0].substring(1)), 0, 0, 1);
                // Create user
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
