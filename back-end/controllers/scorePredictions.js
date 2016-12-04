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
                        predictedScore: 8.5,
                        confidence: 0.99
                    }
                });
            }
        });
    }
};