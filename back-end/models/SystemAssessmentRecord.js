var mongoose= require('mongoose');

var SystemAssessmentRecordSchema= new mongoose.Schema(
	{
		userId:{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		questionSetId:{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'AssessmentQuestionSet'
		},
		systemAssessmentRecords:[{
			questionId:{
				type: mongoose.Schema.Types.ObjectId,
				ref:'AssessmentQuestion'
			},
			chosen:{
				type: Number,
				enum: [1,2,3,4,5]
			}
		}]
	},
	{
		timeStamp:true,
		versionKey:false
	}
)
module.exports = mongoose.model('SystemAssessmentRecord',SystemAssessmentRecordSchema);