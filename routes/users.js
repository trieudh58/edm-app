var express = require('express');
var router = express.Router();
var UserController = require('../controllers/users');
var authentication = require('../middleware/authentication');

/* Authenticate a user */
router.post('/authenticate', UserController.authenticate);

/* Get data of current user */
router.get('/get',authentication, UserController.get);

/* Create a user */
router.post('/create', UserController.create);

module.exports = router;