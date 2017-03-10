var mongoose = require('mongoose');

var SuggestionAndWarning = new mongoose.Schema({
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User',
		require:true,
		unique:true
	},
	currentPerformance:[
		{
			content:String,
			createdAt: {
	          type: Date,
	          default: Date.now
	        }
		}
	],
	graduationCondition:[
		{
			content:String,
			createdAt: {
	          type: Date,
	          default: Date.now
	        }
		}
	]
}, {
    timestamps: true,
    versionKey: false
})
module.exports = mongoose.model('SuggestionAndWarning',SuggestionAndWarning);