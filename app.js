var express = require('express');
var app = express();
var bodyParser = require('body-parser');

/* Import models */
var models = require('./models');

/* Import routes */
var routes = require('./routes');

app.set('port', process.env.PORT || 3001);

/* Body parser configurations */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* Enable CORS */
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/api/v1/users', routes.users);

app.listen(app.get('port'), function () {
    console.log('Server is running on port ' + app.get('port'));
});