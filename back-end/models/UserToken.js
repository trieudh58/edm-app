var mongoose = require('mongoose');

var UserTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
        unique: true
    },
    tokens: [{
        _id: false,
        tokenId: {
            type: String
        }
    }]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('UserToken', UserTokenSchema);