var Subject = require('../../models').Subject;

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/admin/subjects
     * description: Subjects apis (for admin)
     */

    /**
     * @swagger
     * path: /api/v1/admin/subjects/get-names-and-credits
     * operations:
     *   -  httpMethod: GET
     *      summary: Get subject name and credit in list of subjects
     *      notes: Return array of subjects' names and credits
     *      nickname: Get subject names and credits
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return subjects' names and credits */
    getNamesAndCredits: function (req, res) {
        Subject.find({}, 'code name details.credits', function (err, subjects) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            res.json({
                success: true,
                subjects: subjects
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/subjects/get-info
     * operations:
     *   -  httpMethod: GET
     *      summary: Get information of a specific subject
     *      notes: Return subject's detail
     *      nickname: Subject information
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: subjectCode
     *          description: Subject code
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Return one subject's information */
    getInfo: function (req, res) {
        Subject.findOne({
            code: req.query.subjectCode
        }, '-_id -updatedAt -createdAt -__v', function (err, subj) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!subj) {
                res.json({
                    success: false,
                    message: 'Subject does not exist.'
                });
            }
            else {
                res.json({
                    success: true,
                    data: subj
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/subjects/create-subject
     * operations:
     *   -  httpMethod: POST
     *      summary: Create new subject
     *      notes: Return created subject
     *      nickname: Create subject
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: subjectCode
     *          description: Subject code
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: subjectName
     *          description: Subject name
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: subjectCredits
     *          description: Subject credits
     *          paramType: form
     *          required: true
     *          dataType: integer
     *        - name: subjectPrerequisites
     *          description: Subject prerequisites
     *          paramType: form
     *          dataType: string
     */
    /* Return created subject */
    createSubject: function (req, res) {
        Subject.findOne({
            code: req.body.subjectCode
        }, function (err, subj) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!subj) {
                var prerequisitesArr = req.body.subjectPrerequisites.split(',');
                Subject.create({
                    code: req.body.subjectCode,
                    name: {
                        vi: req.body.subjectName
                    },
                    details: {
                        credits: req.body.subjectCredits,
                        prerequisites: prerequisitesArr
                    }
                }, function (err, result) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    res.json({
                        success: true,
                        message: result
                    });
                });
            }
            else {
                res.json({
                    success: false,
                    message: 'Subject already exists.'
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/subjects/delete-subject
     * operations:
     *   -  httpMethod: DELETE
     *      summary: Delete subject
     *      notes: Return result
     *      nickname: Delete subject
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: subjectCode
     *          description: Subject code
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Return deletion result */
    deleteSubject: function (req, res) {
        Subject.findOneAndRemove({
            code: req.query.subjectCode
        }, function (err, deleted) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!deleted) {
                res.json({
                    success: false,
                    message: 'Subject does not exist.'
                });
            }
            else {
                res.json({
                    success: true,
                    message: 'Subject deleted.',
                    data: deleted
                });
            }
        });
    }
};