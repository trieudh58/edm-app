var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      require: true
    },
    comments: [
      {
        _id: false,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          require: true
        },
        commentBody: {
          type: String,
          require: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Comment', CommentSchema);