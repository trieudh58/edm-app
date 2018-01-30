var mongoose = require('mongoose');
var models = require('../models');
var data = require('./data/surveyQuestion');
var question = require('../models/StudentSurveyQuestion');
/* Connect to mongodb */
var config = require('../config');
mongoose.connect(config.mongodb.host, function () {
        console.log('Connected to mongodb.');
});


for(i=0;i<data.length;i++){
	console.log(data[i]);
	question.create(data[i], function (err) {
		console.log(err);
       	if (err) {
            throw err;
        }
        else{
        }
    });
}

// mongoose.disconnect();