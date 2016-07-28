var csv = require('fast-csv');
var fs = require('fs');
var models = require('../models');

var subjectStream = fs.createReadStream(__dirname + '/raw/education_Programs.csv');
var eP = [];
var csvSubjectStream = csv.parse({delimiter: ';'}).on('data', function (data) {
    eP.push(data);
}).on('finish', function () {
    for (var i = 0; i < eP.length; i++) {
        models.EducationProgram.create({
            code: eP[i][0],
            name: eP[i][1],
            totalCredits: eP[i][2]
        }, function (err) {
            if (err) {
                throw err;
            }
        });
    }
    console.log('Education programs imported.');
});
subjectStream.pipe(csvSubjectStream);