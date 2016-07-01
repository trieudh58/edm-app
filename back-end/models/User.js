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
        }
    },
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