var mongoose = require('mongoose')
var StudentSurveyQuestionSchema = new mongoose.Schema(
	{
		question:String,
		choices:[String],
		questionType:{
			type: String,
			enum : ['multipleChoices','checkboxes','textBox','date','time']
		}
	},
	{
		timeStamp:true
	}
)
module.exports = mongoose.model('StudentSurveyQuestion',StudentSurveyQuestionSchema);