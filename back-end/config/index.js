module.exports = {
    app: {
        url: 'http://localhost',
        port: 2052
    },
    frontEnd: {
        url: 'http://edm.tiaset.net',
        port: '80'
    },
    mongodb: {
        host: 'mongodb://thuongdv95:mothaiba@ds137801.mlab.com:37801/gggg'
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
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: 'mdn.edm.team@gmail.com',
            pass: 'teamedm123!@#',
            sender: 'MDN-EDM Team <mdn.edm.team@gmail.com>'
        }
    }

};
