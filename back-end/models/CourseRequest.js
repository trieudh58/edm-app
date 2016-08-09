var mongoose = require('mongoose');

var CourseRequestSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    reason: {
        type: String,
        require: true
    },
    joiners: [{
        _id: false,
        joiner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        createdAt: {
            type: Date,
            require: true,
            default: Date.now
        }
    }],
    courseInfo: {
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            require: true
        },
        semester: {
            type: String,
            require: true
        },
        expectedTime: {
            type: String,
            enum: ['Morning', 'Afternoon', 'Evening']
        }
    },
    status: {
        type: String,
        enum: ['Pending', 'Public', 'Denied']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CourseRequest', CourseRequestSchema);