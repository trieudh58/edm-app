var csv = require('fast-csv');
var fs = require('fs');
var models = require('../models');

var subjectStream = fs.createReadStream(__dirname + '/raw/EP_Detail.csv');
var EPD = [];
var csvSubjectStream = csv.parse({delimiter: ';'}).on('data', function (data) {
    EPD.push(data);
}).on('finish', function () {
    for (var i = 0; i < EPD.length; i++) {
        var subjectList = EPD[i][3].split(',');
        models.EPDetail.create({
            epCode: EPD[i][0],
            kuCode: EPD[i][1],
            totalCreditsByKU: EPD[i][2],
            subjects: subjectList
        }, function (err) {
            if (err) {
                throw err;
            }
        });
    }
    console.log('EP detail imported.');
});
subjectStream.pipe(csvSubjectStream);