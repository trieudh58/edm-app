var models = require('../models');

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
        models.Subject.findOne({
            code: req.query.subjectCode
        }, function (err, subject) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err
                });
            } else if (!subject) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid subject code.'
                });
            } else {
                return res.json({
                    success: true,
                    data: {
                        subjectCode: subject.code,
                        subjectName: subject.name,
                        prediction: {
                            score: 8.5,
                            confidence: 0.99
                        }
                    }
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