var seeder = require('mongoose-seed');
var config = require('../config/index');
var bcrypt = require('bcrypt');
var models = require('../models');

seeder.connect(config.mongodb.host, function () {
   /* Load mongoose models*/
    seeder.loadModels([
        'models/User.js',
        'models/PendingUser.js',
        'models/StudentRecord.js',
        'models/Subject.js',
        'models/KnowledgeUnit.js',
        'models/EducationProgram.js',
        'models/EPDetail.js'
    ]);
    /* Clear models' data */
    seeder.clearModels([
        'User',
        'PendingUser',
        'StudentRecord',
        'Subject',
        'KnowledgeUnit',
        'EducationProgram',
        'EPDetail'
    ], function () {
        console.log('Connected to mongodb.');
        seeder.populateModels(data);

        /* Import user records from csv files */
        require('./importUserRecords');

        /* Import subjects from csv files */
        require('./importSubjects');

        /* Import knowledge units from csv file */
        require('./importKnowledgeUnits');

        /* Import education programs from csv file */
        require('./importEducationPrograms')

        /* Import EP detail from csv file */
        require('./importEPDetail');
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
