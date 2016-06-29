var express = require('express');
var router = express.Router();
var User = require('../models').User;

router.get('/all', function (req, res) {
    User.find({}, ' -_id email firstName lastName age isAdmin', function (err, users) {
        if (err) {
            res.status(500).json({
                error: err
            })
        }
        res.json(users);
    })
});

/* Create a user */
router.post('/create', function (req, res) {
    User.create({
        email: 'edm@gmail.com',
        password: '123456',
        firstName: 'EDM',
        lastName: 'Admin',
        age: 20,
        isAdmin: true
    }, function (err, user) {
        if (err) {
            res.status(500).json({
                message: err
            });
        }
        res.json({
            message: 'SUCCESS',
            data: user
        });
    });
});

module.exports = router;