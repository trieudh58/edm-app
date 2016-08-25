var csv = require('fast-csv');
var fs = require('fs');
var models = require('../models');

var subjectStream = fs.createReadStream(__dirname + '/raw/ScienceResearch.csv');
var SR = [];
var SRStream = csv.parse({delimiter: '|'}).on('data', function (data) {
    SR.push(data);
}).on('finish', function () {
    for (var i = 1; i < SR.length; i++) {
        if (SR[i][4] && SR[i][4] !== '' && SR[i][4] !== ' ') {
            var teach = SR[i][4].split(';');
        }
        if (SR[i][4] && SR[i][5] !== '' && SR[i][5] !== ' ') {
            var study = SR[i][5].split(';');
        }
        if (SR[i][6] && SR[i][6] !== '' && SR[i][6] !== ' ') {
            var thesisGuide = SR[i][6].split(';');
        }
        models.SRDirection.create({
            lecturer: SR[i][1],
            degree: SR[i][2],
            workplace: SR[i][3],
            teach: teach,
            study: study,
            thesisGuide: thesisGuide
        }, function (err) {
            if (err) {
                throw err;
            }
        });
    }
    console.log('Science research imported.');
});
subjectStream.pipe(SRStream);