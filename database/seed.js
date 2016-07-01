var seeder = require('mongoose-seed');
var config = require('../config');
var bcrypt = require('bcrypt');

seeder.connect(config.mongodb.host, function () {
   /* Load mongoose models*/
    seeder.loadModels([
        'models/User.js'
    ]);
    /* Clear models' data */
    seeder.clearModels([
        'User'
    ], function () {
        seeder.populateModels(data);
    });
});

/* Data to be populated */
var data = [
    {
        'model': 'User',
        'documents': [
            {
                email: 'admin@gmail.com',
                password: bcrypt.hashSync('123456', config.bcrypt.saltRounds),
                isAdmin: true
            },
            {
                email: 'test@gmail.com',
                password: bcrypt.hashSync('123456', config.bcrypt.saltRounds),
                isAdmin: false
            },
            {
                email: 'seed@gmail.com',
                password: bcrypt.hashSync('123456', config.bcrypt.saltRounds),
                isAdmin: false
            },
        ]
    }
];

module.exports = seeder;