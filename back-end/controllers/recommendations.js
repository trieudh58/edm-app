var models = require('../models');
var http = require('http');
var StudentServeyAnswer=require('../models').StudentSurveyAnswer;

function surveyFeatureExtraction(answersList){
    var interests = [3,3,3,3];
    var questionCodeListForInterest = ['1','2','3','4'];
    var target = 1;
    var faculty = 1;
    if(answersList){
        for(i=0;i<answersList.length;i++){
            if(answersList[i].questionCode == 10) faculty = answersList[i].chosenAnswers;
            if(answersList[i].questionCode == 12) target = answersList[i].chosenAnswers;
            if(questionCodeListForInterest.includes(answersList[i].questionCode)){
                interests[answersList[i].questionCode-1]=answersList[i].chosenAnswers;
            }
        }
    }
    return [interests,target,faculty];
}
function maxSemester(records){
    var max = 0;
    var attempt ={};
    for(i=0;i<records.length;i++){
        attempt = records[i].attempt;
        if(attempt[attempt.length-1].semester > max) max = attempt[attempt.length-1].semester;
    }
    return max;
}
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
        StudentServeyAnswer.findOne({userId:req.user.id}, function(err, answers){
            if(err){
                return res.status(500).json({
                    success:false,
                    message:err
                })
            }
            else{
                var [interests,target,faculty] =surveyFeatureExtraction((answers||{}).answerList);
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
                        var studentId = parseInt(req.user.studentCode);
                        studentId = isNaN(studentId) ? 1402000:studentId;
                        var url = 'http://localhost:8081/webservices/study-recommend/study-stragy?faculty='+ faculty + '&target='+ target+'&studentId='+studentId+'&interests='+JSON.stringify(interests)+'&gender='+gender+'&semester='+currendSemester+'&records='+JSON.stringify(studentRecord.record);     
                        http.get(url, r => {
                            r.setEncoding("utf8");
                            let body = "";
                            r.on("data", data => {
                                body += data;
                            });
                            r.on("end", () => {
                                try{
                                    body = JSON.parse(body);
                                    res.json({
                                            success: true,
                                            data: body.data  
                                        });
                                    }
                                catch(err){
                                    res.json({
                                        success: false
                                    })
                                }
                            });
                        });
                    }
                });
            }
        })
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
        StudentServeyAnswer.findOne({userId:req.user.id}, function(err, answers){
            if(err){
                return res.status(500).json({
                    success:false,
                    message:err
                })
            }
            else{
                var [interests,target,faculty] =surveyFeatureExtraction((answers||{}).answerList);
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
                        var studentId = parseInt(req.user.studentCode);
                        studentId = isNaN(studentId) ? 1402000:studentId;
                        var url = 'http://localhost:8081/webservices/study-recommend/next-semester-subjects?faculty='+faculty+'&target='+target+'&studentId='+studentId+'&interests='+JSON.stringify(interests)+'&gender='+gender+'&semester='+currendSemester+'&records='+JSON.stringify(studentRecord.record);
                         
                        http.get(url, r => {
                          r.setEncoding("utf8");
                          let body = "";
                          r.on("data", data => {
                            body += data;
                          });
                          r.on("end", () => {
                            try{
                                body = JSON.parse(body);
                                models.Subject.find({code: {$in :body.subjects}}).exec(function (err, subjects) {
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
                                                    subjectDetails: subject.details
                                                });
                                            });
                                            return res.json({
                                                success: true,
                                                data: subjectList
                                            });
                                        }
                                    });
                                }
                                catch(err){
                                    res.json({success: false});
                                }
                            });
                        });
                    }
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
     *      notes: Return most related thesis to recommend
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
    },

    /**
     * @swagger
     * path: /api/v1/recommendations/get-recommended-research-topics
     * operations:
     *   -  httpMethod: GET
     *      summary: Get recommended research topics
     *      notes: Return most related research topics to recommend
     *      nickname: Get recommended research topics
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get recommended research topics */
    getRecommendedResearchTopics: function getRecommendedResearchTopics (req, res) {
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