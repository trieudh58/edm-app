var mongoose = require('mongoose');

var BlackListTokenSchema = new mongoose.Schema({
    token: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BlackListToken', BlackListTokenSchema);