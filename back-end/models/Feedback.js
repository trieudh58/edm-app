var mongoose = require('mongoose');

var FeedbackSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  header: {
    type: String,
    require: true
  },
  body: {
    type: String,
    require: true
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Feedback', FeedbackSchema);