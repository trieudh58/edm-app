var mongoose = require('mongoose');

var BlackListTokenSchema = new mongoose.Schema({
    tokenId: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('BlackListToken', BlackListTokenSchema);