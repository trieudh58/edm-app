var seeder = require('mongoose-seed');
var config = require('../config/index');
var bcrypt = require('bcrypt');
var models = require('../models');
var async = require('async');

seeder.connect(config.mongodb.host, function () {
   /* Load mongoose models*/
    seeder.loadModels([
        'models/User.js',
        'models/PendingUser.js',
        'models/StudentRecord.js',
        'models/Subject.js',
        'models/KnowledgeUnit.js',
        'models/EducationProgram.js',
        'models/EPDetail.js',
        'models/StudentGroup.js',
        'models/BlackListToken.js',
        'models/Notification.js',
        'models/UserToken.js',
        'models/SRDirection.js'
    ]);
    /* Clear models' data */
    seeder.clearModels([
        'User',
        'PendingUser',
        'StudentRecord',
        'Subject',
        'KnowledgeUnit',
        'EducationProgram',
        'EPDetail',
        'StudentGroup',
        'Notification',
        'BlackListToken',
        'UserToken',
        'SRDirection'
    ], function () {
        var queue = [
            function (callback) {
                console.log('Connected to mongodb.');
                seeder.populateModels(data);
                callback(null);
            }
        ];
        queue.push(function (callback) {
            /* Create student groups */
            require('./createStudentGroups.js');
            callback(null);
        });
        queue.push(function (callback) {
            /* Import subjects from csv files */
            require('./importSubjects');
            callback(null);
        });
        queue.push(function (callback) {
            /* Import knowledge units from csv file */
            require('./importKnowledgeUnits');
            callback(null);
        });
        queue.push(function (callback) {
            /* Import education programs from csv file */
            require('./importEducationPrograms');
            callback(null);
        });
        queue.push(function (callback) {
            /* Import EP detail from csv file */
            require('./importEPDetail');
            callback(null);
        });
        queue.push(function (callback) {
            /* Import science research directions */
            require('./importScienceResearch.js');
            callback(null);
        });
        queue.push(function (callback) {
            /* Import user records from csv files */
            require('./importUserRecords');
            callback(null);
        });
        async.waterfall(queue, function (err) {
            if (err)
                throw err;
        });
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
