var csv = require('fast-csv');
var fs = require('fs');
var models = require('../models');

var subjectStream = fs.createReadStream(__dirname + '/raw/subject_List.csv');
var subjects = [];
var csvSubjectStream = csv.parse({delimiter: ';'}).on('data', function (data) {
    subjects.push(data);
}).on('finish', function () {
    for (var i = 0; i < subjects.length; i++) {
        var prerequisiteArr = subjects[i][7].split('/');
        for (var idx = 0; idx < prerequisiteArr.length; idx++) {
            if (prerequisiteArr[idx] == '') {
                prerequisiteArr.pop(idx);
            }
            else {
                prerequisiteArr[idx] = prerequisiteArr[idx].replace(' ','');
            }
        }
        models.Subject.create({
            code: subjects[i][0],
            name: {
                vi: subjects[i][1],
                en: subjects[i][2]
            },
            details: {
                credits: subjects[i][3],
                onClassHour: subjects[i][4],
                practiceHour: subjects[i][5],
                SelfTrainHour: subjects[i][6],
                prerequisites: prerequisiteArr
            }
        }, function (err) {
            if (err) {
                throw err;
            }
        });
    }
    console.log('Subjects imported.');
});
subjectStream.pipe(csvSubjectStream);