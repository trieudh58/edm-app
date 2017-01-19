var mongoose= require('mongoose');

var AssessmentQuestionSchema = new mongoose.Schema(
	{
		content: {
			type:String,
			require:true
		},
		purpose:{
			type:String,
			enum:['systemAssessment','courseClassAssessment'],
			require:true
		}
	},
	{
		timeStamp:true,
		versionKey:false
	}
);
module.exports = mongoose.model('AssessmentQuestion',AssessmentQuestionSchema);