var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var swagger = require('swagger-express');

/* Import models */
var models = require('./models');

/* Import routes */
var routes = require('./routes');

app.set('port', process.env.PORT || 3001);

/* Body parser configurations */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* Use morgan to log requests to console */
app.use(morgan('dev'));

/* Enable CORS */
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

/* API v1 routes */
app.use('/api/v1', routes);

/* Swagger */
app.use(swagger.init(app, {
    apiVersion: '1.0',
    swaggerVersion: '1.0',
    swaggerURL: '/swagger',
    swaggerJSON: '/swagger.json',
    swaggerUI: './public/swagger/',
    basePath: 'http://localhost:3001',
    info: {
        title: 'EDM API',
        description: 'EDM API'
    },
    apis: [
        './controllers/users.js'
    ]
}));

/* Server starts */
app.listen(app.get('port'), function () {
    console.log('Server is running on port ' + app.get('port'));
});