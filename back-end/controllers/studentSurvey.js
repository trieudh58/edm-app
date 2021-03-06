var question = require('../models').StudentSurveyQuestion;
var questionType=require('../models').StudentSurveyQuestionType;
var StudentServeyAnswer=require('../models').StudentSurveyAnswer;
module.exports = {
        /**
     * @swagger
     * resourcePath: /api/v1/student-survey
     * description: student survey apis
     */

    /**
     * @swagger
     * path: /api/v1/student-survey/get-student-survey-question-list
     * operations:
     *   -  httpMethod: GET
     *      summary: Get list of question for student survey
     *      notes: Return array of question and choices(if exist)
     *      nickname: Get question and choice
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return question-choices list */
    getQuestionList: function (req, res) {
        question.find({}, function (err, questions) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                StudentServeyAnswer.findOne({userId:req.user.id}, function(err, answers){
                    if(err){
                        return res.status(500).json({
                            success:false,
                            message:err
                        })
                    }
                    else{
                        res.json({
                            success: true,
                            questions: questions,
                            answers: answers
                        });
                    }
                })
            }
        });
    },
        /**
     * @swagger
     * path: /api/v1/student-survey/submit-student-survey
     * operations:
     *   -  httpMethod: POST
     *      summary: submit survey answers
     *      notes: 
     *      nickname: create new studentSurvey appriciate user and questions
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: answerList
     *          description: json form of a list which contains questionId and chosenAnswers
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Create student survey answers */
 	submitStudentSurvey: function(req,res){
 		try {
            var answerList = JSON.parse(req.body.answerList);
            var StudentAnswer={userId:req.user.id,answerList:answerList};
            StudentServeyAnswer.findOne({userId:req.user.id},function(err,object){
                if(err){
                    return res.status(500).json({
                        success:false,
                        message:err
                    })
                }
                else{
                        if(object){
                            StudentServeyAnswer.update({userId:req.user.id},{$set:{answerList:answerList}},function(err){
                                if(err){
                                    return res.status(500).json({
                                        success:false,
                                        message:err
                                    })
                                }
                                else{
                                    return res.status(200).json({
                                        success:true,
                                        message:'update answers success!'
                                    })
                                }
                            })
                        }
                        else{
                            StudentServeyAnswer.create({userId:req.user.id,answerList:answerList},function(err,object){
                                if (err)
                                    return res.status(500).json({
                                        success:false,
                                        message:err
                                    })
                                return res.json({
                                    success: true,
                                    message: 'submited!'
                                });
                            })
                        }
                }
            })
            //create student answer
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err
            });
        }

    }
};