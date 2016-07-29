var mongoose = require('mongoose');

var NotificationSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    targetGroups: [{
        type: String,
        ref: 'User'
    }],
    isSent: {
        type: Boolean,
        require: true,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', NotificationSchema);