var models = require('../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/recommendations
     * description: Recommendations apis
     */

    /**
     * @swagger
     * path: /api/v1/recommendations/get-study-path
     * operations:
     *   -  httpMethod: GET
     *      summary: Get study path
     *      notes: Return study path (with subject divided by semesters)
     *      nickname: Get study path
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return study path */
    getStudyPath: function (req, res) {
        // Hard-coded. Need to be enhanced
        models.EPDetail.find({
            epCode: 1
        }).sort({
            kuCode: 'asc'
        }).exec(function (err, epDetail) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!epDetail || !epDetail.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid code.'
                });
            }
            else {
                var allSubjects = [];
                for (var i = 0; i < epDetail.length; i++) {
                    allSubjects = allSubjects.concat(epDetail[i].subjects);
                }
                var semesters = [];
                for (var j = 0; j < allSubjects.length; j++) {
                    semesters.push({
                        subject: allSubjects[j],
                        name: 'Tín hiệu và hệ thống',
                        credit: 3,
                        semester: j%8 + 1
                    });
                }
                return res.json({
                    success: true,
                    data: semesters
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/recommendations/get-next-semester-subjects
     * operations:
     *   -  httpMethod: GET
     *      summary: Get next semester subjects
     *      notes: Return next semester subjects (provided by suggestion)
     *      nickname: Get next semester subjects
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return next semester subjects */
    getNextSemesterSubjects: function (req, res) {
        // Hard-coded. Need to be enhanced
        models.Subject.find({}, '-createdAt -updatedAt').limit(7).exec(function (err, subjects) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                let subjectList = [];
                subjects.forEach(function (subject, idx) {
                    subjectList.push({
                        subjectCode: subject.code,
                        subjectName: subject.name,
                        subjectDetails: subject.details,
                        prediction: {
                            score: 8.5,
                            confidence: 0.99
                        }
                    });
                });
                return res.json({
                    success: true,
                    data: subjectList
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/recommendations/get-recommended-thesis
     * operations:
     *   -  httpMethod: GET
     *      summary: Get recommended thesis
     *      notes: Return 3 most related thesis to recommend
     *      nickname: Get recommended thesis
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get recommended thesis */
    getRecommendedThesis: function getRecommendedThesis (req, res) {
        return res.json({
            success: true,
            data: [
                {
                    _id: 0,
                    supervisor: 'PGS. TS. Phan Xuân Hiếu',
                    studyField: ['Khai phá dữ liệu', 'Xử lý ngôn ngữ tự nhiên'],
                    topics: [
                        'Xác định ý định người dùng và ứng dụng trong xây dựng chatbot thương mại điện tử',
                        'Kích hoạt bằng giọng nói sử dụng nhận dạng từ khoá và xác minh người nói',
                        'Dự đoán kết quả học tập của sinh viên sử dụng các phương pháp trong hệ gợi ý'
                    ]
                },
                {
                    _id: 1,
                    supervisor: 'PGS. TS. Phan Xuân Hiếu',
                    studyField: ['Khai phá dữ liệu', 'Xử lý ngôn ngữ tự nhiên'],
                    topics: [
                        'Xác định ý định người dùng và ứng dụng trong xây dựng chatbot thương mại điện tử',
                        'Kích hoạt bằng giọng nói sử dụng nhận dạng từ khoá và xác minh người nói',
                        'Dự đoán kết quả học tập của sinh viên sử dụng các phương pháp trong hệ gợi ý'
                    ]
                },
                {
                    _id: 2,
                    supervisor: 'PGS. TS. Phan Xuân Hiếu',
                    studyField: ['Khai phá dữ liệu', 'Xử lý ngôn ngữ tự nhiên'],
                    topics: [
                        'Xác định ý định người dùng và ứng dụng trong xây dựng chatbot thương mại điện tử',
                        'Kích hoạt bằng giọng nói sử dụng nhận dạng từ khoá và xác minh người nói',
                        'Dự đoán kết quả học tập của sinh viên sử dụng các phương pháp trong hệ gợi ý'
                    ]
                }
            ]
        });
    }
};