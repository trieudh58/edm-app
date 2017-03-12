var mongoose = require('mongoose');

var ImportantNotificationSchema = new mongoose.Schema({
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true
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
    isPublished: {
      type: Boolean,
      default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('ImportantNotification', ImportantNotificationSchema);