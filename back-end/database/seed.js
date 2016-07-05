var seeder = require('mongoose-seed');
var config = require('../config/index');
var bcrypt = require('bcrypt');
var models = require('../models');

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
        console.log('Connected to mongodb.');
        seeder.populateModels(data);

        /* Import data from csv files */
        require('./importCSV');
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
