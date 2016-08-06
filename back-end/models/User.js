var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    studentCode: {
        type: String
    },
    personalInfo: {
        gender: {
            type: Boolean
        },
        DOB: {
            type: Date
        },
        className: {
            type: String
        },
        groups: [{
            _id: false,
            group: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'StudentGroup'
            }
        }]
    },
    notificationStack: [{
        _id: false,
        notification: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification',
            require: true
        },
        isRead: {
            type: Boolean,
            require: true,
            default: false
        },
        isImportant: {
            type: Boolean,
            require: true,
            default: false
        },
        createdAt: {
            type: Date,
            require: true,
            default: Date.now
        }
    }],
    isAdmin: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);