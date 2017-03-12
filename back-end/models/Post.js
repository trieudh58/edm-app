var mongoose = require('mongoose');
var config=require('../config');
var PostSchema = new mongoose.Schema({
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true
    },
    coverImage: {
        type: String,
        default: config.app.url + ':' + config.app.port + '/images/default.jpg' 
    },
    header: {
      type: String,
      require: true
    },
    sumary: {
      type: String,
      require: true
    },
    body: {
      type: String,
      require: true
    },
    comments: [{
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
    }],
    isPublished: {
      type: Boolean,
      default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Post', PostSchema);