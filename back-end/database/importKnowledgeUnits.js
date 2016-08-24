var csv = require('fast-csv');
var fs = require('fs');
var models = require('../models');

var subjectStream = fs.createReadStream(__dirname + '/raw/knowledge_Units.csv');
var kU = [];
var csvSubjectStream = csv.parse({delimiter: ';'}).on('data', function (data) {
    kU.push(data);
}).on('finish', function () {
    for (var i = 0; i < kU.length; i++) {
        models.KnowledgeUnit.create({
            kuCode: kU[i][0],
            name: kU[i][1]
        }, function (err) {
            if (err) {
                throw err;
            }
        });
    }
    console.log('Knowledge units imported.');
});
subjectStream.pipe(csvSubjectStream);