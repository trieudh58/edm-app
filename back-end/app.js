var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var swagger = require('swagger-express');
var config = require('./config');
var http = require('http');
var cors = require('cors');

/* Import models */
var models = require('./models');

/* Import routes */
var routes = require('./routes');

app.set('port', process.env.PORT || 2052);
app.set('host', config.app.url);

/* Body parser configurations */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* Use morgan to log requests to console */
app.use(morgan('dev'));

//app.use(cors());

/* Enable CORS */
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, api_key, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

/* API v1 routes */
app.use('/api/v1', routes);

/* Swagger */
app.use(swagger.init(app, {
    apiVersion: '2.0',
    swaggerVersion: '2.0',
    swaggerURL: '/swagger',
    swaggerJSON: '/swagger.json',
    swaggerUI: './public/swagger/',
    basePath: config.app.url + ':2052',
    info: {
        title: 'EDM API',
        description: 'EDM API'
    },
    apis: [
        './controllers/users.js',
        './controllers/studentRecords.js',
        './controllers/subjects.js',
        './controllers/notifications.js',
        './controllers/courseRequests.js',
        './controllers/tokens.js',
        './controllers/educationPrograms.js',
        './controllers/recommendations.js',
        './controllers/scienceResearchDirections.js',
        './controllers/admin/users.js',
        './controllers/admin/studentRecords.js',
        './controllers/admin/subjects.js',
        './controllers/admin/notifications.js',
        './controllers/admin/studentGroups.js',
        './controllers/admin/courseRequests.js'
    ]
}));
app.get('/',function(req,res){res.end("Hello")});
server = http.createServer(app);

/* Server starts */
server.listen(app.get('port'), function () {
    /*
    * Seed data to mongodb
    * COMMENT "Line 2" if you had imported it before,
    * Or COMMENT "Line 1" and UNCOMMENT "Line 2" then restart app.js to re-import.
    * */

    // Line 1
    models.dbConnect();

    // Run npm run-script import to import data from database/dump/edm-api to mongodb

    // Line 2
    //require('./database/seed');

    console.log('Server is running on port ' + app.get('port'));
});
