var models = require('../../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/admin/student-groups
     * description: Student groups apis (for admin)
     */

    /**
     * @swagger
     * path: /api/v1/admin/student-groups/get-all
     * operations:
     *   -  httpMethod: GET
     *      summary: Get all student groups
     *      notes: Return student groups
     *      nickname: Get student groups
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return student groups */
    getAll: function (req, res) {
        models.StudentGroup.find({}).sort({
            name: 'asc'
        }).exec(function (err, groups) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.json({
                    success: true,
                    data: groups
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/student-groups/create
     * operations:
     *   -  httpMethod: POST
     *      summary: Create new student group
     *      notes: Return created group
     *      nickname: Create student groups
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: groupName
     *          description: Student group
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Return created student group */
    create: function (req, res) {
        models.StudentGroup.findOne({
            name: req.body.groupName
        }, function (err, group) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (group) {
                return res.status(400).json({
                    success: false,
                    message: 'Group existed.'
                });
            }
            else {
                models.StudentGroup.create({
                    name: req.body.groupName
                }, function (err, createdGroup) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        return res.json({
                            success: true,
                            message: 'Group created.',
                            data: createdGroup
                        });
                    }
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/student-groups/delete-by-id
     * operations:
     *   -  httpMethod: DELETE
     *      summary: Delete a student group by id
     *      notes: Return delete result
     *      nickname: Delete student group
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: groupId
     *          description: Student group id
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Return delete result */
    deleteById: function (req, res) {
        models.StudentGroup.findByIdAndRemove(req.body.groupId, function(err, result) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!result) {
                return res.status(400).json({
                    success: false,
                    message: 'Group does not exist.'
                });
            }
            else {
                return res.json({
                    success: true,
                    message: 'Group deleted.'
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/student-groups/delete-by-name
     * operations:
     *   -  httpMethod: DELETE
     *      summary: Delete a student group by name
     *      notes: Return delete result
     *      nickname: Delete student group
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: groupName
     *          description: Student group name
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Return delete result */
    deleteByName: function (req, res) {
        models.StudentGroup.findOneAndRemove({
            name: req.query.groupName
        }, function(err, result) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!result) {
                return res.status(400).json({
                    success: false,
                    message: 'Group does not exist.'
                });
            }
            else {
                return res.json({
                    success: true,
                    message: 'Group deleted.'
                });
            }
        });
    }
};