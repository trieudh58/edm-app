var question = require('../../models').StudentSurveyQuestion;
var questionType=require('../../models').StudentSurveyQuestionType;
var StudentServeyAnswer=require('../../models').StudentSurveyAnswer;

module.exports = {
        /**
     * @swagger
     * resourcePath: /api/v1/admin/student-survey
     * description: admin api for student survey management
     */

    /**
     * @swagger
     * path: /api/v1/admin/student-survey/create-student-survey-question
     * operations:
     *   -  httpMethod: POST
     *      summary: Create question for student survey
     *      notes: 
     *      nickname: Create student survey question
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: question
     *          description: question
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: questionType
     *          description: type of inputed question
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: choices
     *          description: list of choices for above question if exist, separated by '|'
     *          paramType: form
     *          required: false
     *          dataType: string
     */
    /* Create new question */
    createStudentSurveyQuestion: function (req, res) {
    	if(req.body.choices)
    		var choices=req.body.choices.split('|');
    	else
    		var choices=[]
    	question.create({
    		question:req.body.question,
    		questionType:req.body.questionType,
    		choices:choices,
    	},function (err) {
    		if(err){
    			return res.status(500).json({
    				success:false,
    				message:err
    			})
    		}
    		else{
    			return res.status(200).json({
    				success:true,
    				message:'create successfully a new question.'
    			})
    		}
    	})
    },
        /**
     * @swagger
     * path: /api/v1/admin/student-survey/update-student-survey-question
     * operations:
     *   -  httpMethod: PUT
     *      summary: update question for student survey
     *      notes: 
     *      nickname: update student survey question
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: id
     *          description: id
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: question
     *          description: question
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: questionType
     *          description: type of inputed question
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: choices
     *          description: list of choices for above question if exist, separated by '|'
     *          paramType: form
     *          required: false
     *          dataType: string
     */
    /* update the question */
    updateStudentSurveyQuestion: function(req,res){
    	if(req.body.choices)
    		var choices=req.body.choices.split('|');
    	else
    		var choices=[]
    	question.update({_id:req.body.id},{
    		questionType:req.body.questionType,
    		question:req.body.question,
    		choices:req.body.choices	
    	},function (err) {
    		if(err){
    			return res.status(500).json({
    				success:false,
    				message:err
    			})
    		}
    		else{
    			return res.status(200).json({
    				success:true,
    				message:'update question successfully.'
    			})
    		}
    	})
    },

    /**
     * @swagger
     * path: /api/v1/admin/student-survey/get-question-type
     * operations:
     *   -  httpMethod: GET
     *      summary: Get question types
     *      notes:
     *      nickname: Get supported question types
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get question types */
    getStudentSurveyQuestionType: function(req,res){
    	try{
	    	questionTypes = question.schema.path('questionType').enumValues;
	    	return res.status(200).json({
	    		success:true,
	    		data:questionTypes
	    	})
	    }
	    catch(err){
	    	return res.status(500).json({
	    		success:false,
	    		message:err
	    	})
	    }
    },
        /**
     * @swagger
     * path: /api/v1/admin/student-survey/delete-question
     * operations:
     *   -  httpMethod: DELETE
     *      summary: delete question
     *      notes:
     *      nickname: delete survey question
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: questionId
     *          description: question id
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Delete questions */
    deleteStudentSurveyQuestion: function(req,res){
    	question.findOne({_id:req.body.questionId},function (err,object) {
    		if(err){
    			return res.status(500).json({
    				success:false,
    				message:err
    			})
    		}
    		else{
    			if(!object)
    				return res.status(400).json({
    					success:false,
    					message:'ID does not exist.'
    				})
    			else{
    				object.remove(function (err) {
    					if(err)
    						return res.status(500).json({
    							success:false,
    							message:'fail to delete question.'
    						})
    					else
    						return res.status(200).json({
    							success:true,
    							message:'success to delete.'
    						})
    				})
    			}
    		}
    	})
    }
};