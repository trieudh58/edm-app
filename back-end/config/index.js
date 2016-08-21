module.exports = {
    app: {
        url: 'http://localhost:3001'
    },
    frontEnd: {
        url: 'http://localhost',
        port: '9999'
    },
    mongodb: {
        host: 'mongodb://localhost:27017/edm-api'
    },
    jwt: {
        secret: '!@#@HRHQ12d21sa#$%@#%#@dsa2422234242dsf232@#',
        expiresTime: {
            accessToken: '1h',
            refreshToken: '14d'
        }
    },
    bcrypt: {
        saltRounds: 10
    },
    mailer: {
        service: 'Gmail',
        user: 'mdn.edm.team@gmail.com',
        pass: 'teamedm123!@#',
        sender: 'MDN-EDM Team <mdn.edm.team@gmail.com>'
    }
};