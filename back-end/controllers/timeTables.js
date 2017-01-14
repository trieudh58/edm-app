var models = require('../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/time-tables
     * description: Time tables apis
     */

    /**
     * @swagger
     * path: /api/v1/time-tables/get-school-time-table
     * operations:
     *   -  httpMethod: GET
     *      summary: Get the general time table of the school
     *      notes: Return school time table
     *      nickname: Get school time table
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get school time table */
    getSchoolTimeTable: function getTimeTable (req, res) {
        models.Subject.find({}, '-createdAt -updatedAt', function (err, result) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            } else if (!result) {
                return res.status(400).json({
                    success: false,
                    message: 'Subject list is empty.'
                });
            } else {
                var timeTable = [];
                result.forEach(function (subject, idx) {
                    timeTable.push({
                        subject: subject,
                        classCode: subject.code + ' 2',
                        theory: {
                            lecturer: 'PGS.TS. Phan Xuân Hiếu',
                            classTime: {
                                weekday: 0,
                                session: {
                                    start: 3,
                                    end: 5
                                }
                            },
                            auditorium: '308 GD2'
                        },
                        practice: [
                            {
                                groupId: 0,
                                lecturer: 'CN. Vương Thị Hải Yến',
                                classTime: {
                                    weekday: 2,
                                    session: {
                                        start: 4,
                                        end: 6
                                    }
                                },
                                auditorium: '208 G2'
                            },
                            {
                                groupId: 1,
                                lecturer: 'CN. Dương Quang Vũ',
                                classTime: {
                                    weekday: 2,
                                    session: {
                                        start: 8,
                                        end: 10
                                    }
                                },
                                auditorium: '203 G2'
                            },
                        ],
                    });
                });
                res.json({
                    success: false,
                    data: timeTable
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/time-tables/create-personal-time-table
     * operations:
     *   -  httpMethod: POST
     *      summary: Create personal time table
     *      notes: Return result (success or not)
     *      nickname: Create personal time table
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: classInfoList
     *          description: stringify of list contains classCode and groupId
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Create personal time table */
    createPersonalTimeTable: function createPersonalTimeTable (req, res) {
        try {
            var classInfoList = JSON.parse(req.body.classInfoList);
            console.log(classInfoList);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err
            });
        }
        return res.json({
            success: true,
            message: 'Personal time table created.'
        });
    },

    /**
     * @swagger
     * path: /api/v1/time-tables/get-personal-time-table
     * operations:
     *   -  httpMethod: GET
     *      summary: Get personal time table
     *      notes: Return personal time table
     *      nickname: Get personal time table
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get personal time table */
    getPersonalTimeTable: function getPersonalTimeTable (req, res) {
        return res.json({
            success: true,
            data: [
                {
                    classCode: 'INT2203 4',
                    groupId: 2
                },
                {
                    classCode: 'INT3052 2'
                },
                {
                    classCode: 'INT2203 4',
                    groupId: 0
                },
            ]
        });
    }
};