var mongoose = require('mongoose');
var AssessmentQuestionSetSchema= mongoose.Schema({
		name:String,
		questionList:[{
			type: mongoose.Schema.Types.ObjectId,
			ref:'AssessmentQuestion'
		}],
		purpose:{
			type:String,
			enum:['systemAssessment','courseClassAssessment'],
			require:true
		},
		active:
		{
			type:Boolean,
			default: false
		}
	},
	{
		timeStamp:true,
		versionKey:false
	}
)
module.exports= mongoose.model('AssessmentQuestionSet',AssessmentQuestionSetSchema);