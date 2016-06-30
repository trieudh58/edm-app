module.exports = {
    app: {
        url: 'http://localhost:3001'
    },
    mongodb: {
        host: 'mongodb://localhost:27017/edm-api'
    },
    jwt: {
        secret: '!@#@HRHQ12d21sa#$%@#%#@dsa2422234242dsf232@#',
        expiresTime: '24h'
    },
    bcrypt: {
        saltRounds: 10
    }
};