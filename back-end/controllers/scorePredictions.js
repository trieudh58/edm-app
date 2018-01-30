var models = require('../models');
var http = require('http');

var optionsget = {
    host : 'localhost',
    port : 8081,
    path : '/',
    method : 'GET'
};
function maxSemester(records){
    var max = 0;
    var attempt ={};
    for(i=0;i<records.length;i++){
        attempt = records[i].attempt;
        if(attempt[attempt.length-1].semester > max) max = attempt[attempt.length-1].semester;
    }
    return parseInt(max)+1;
}
module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/score-predictions
     * description: Score predictions apis
     */

    /**
     * @swagger
     * path: /api/v1/score-predictions/predict-one-subject
     * operations:
     *   -  httpMethod: GET
     *      summary: Predict score of one subject
     *      notes: Return the score of one subject
     *      nickname: Predict subject score
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: subjectCode
     *          description: Subject code
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Predict score of one subject */
    predictOneSubject: function predictOneSubject (req, res) {
        models.StudentRecord.findOne({
            studentCode: req.user.studentCode
        }, function (err, studentRecord) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else{
                var gender = req.user.personalInfo.gender? 'Nam':'Nữ';
                var currendSemester = maxSemester(studentRecord.record);
                var url = 'http://localhost:8081/webservices/score/predict?subjectCode='+req.query.subjectCode+'&gender='+gender+'&semester='+currendSemester+'&records='+JSON.stringify(studentRecord.record);
                 
                http.get(url, r => {
                  r.setEncoding("utf8");
                  let body = "";
                  r.on("data", data => {
                    body += data;
                  });
                  r.on("end", () => {
                    try{
                        body = JSON.parse(body);
                        // console.log(body);
                        res.json({
                            success: true,
                            data: {
                                prediction: body.predictScore
                            }
                        });
                    }
                    catch(err){
                        res.json({
                            success: false
                        });
                    }

                  });
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/score-predictions/predict-list-of-subjects
     * operations:
     *   -  httpMethod: GET
     *      summary: Predict score for a list of subjects
     *      notes: Return the score for a list of subjects
     *      nickname: Predict scores for a subject list
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: subjectCodeList
     *          description: Subject code list (each separated by a comma)
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Predict scores for a subject list */
    predictListOfSubjects: function (req, res) {
        var subjectCodeList = req.query.subjectCodeList.split(',');
        if (subjectCodeList.length) {
            models.Subject.find({
                code: {
                    $in: subjectCodeList
                }
            }, function (err, subjects) {
                if (err)
                    return handleInternalDBError(err, res);
                if (!subjects.length)
                    return handleUserErrorWithCustomMessage(res, 'Invalid subject code list');
                var prediction = [];
                for (var i = 0; i < subjects.length; i++) {
                    prediction.push({
                        subjectCode: subjects[i].code,
                        subjectName: subjects[i].name,
                        prediction: {
                            score: (Math.random() * 9 + 1).toFixed(2),
                            confidence: Math.random().toFixed(2)
                        }
                    });
                }
                return res.json({
                    success: true,
                    data: prediction
                });
            });
        }
        else {
            return handleUserErrorWithCustomMessage(res, 'Invalid subject code list');
        }
    }
};

function handleInternalDBError(err, res) {
    return res.status(500).json({
        success: false,
        message: err
    });
}

function handleUserErrorWithCustomMessage(res, customMessage) {
    return res.status(400).json({
        success: false,
        message: customMessage
    });
}