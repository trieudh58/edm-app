var express = require('express');
var router = express.Router();
var UserController = require('../controllers/users');
var authentication = require('../middleware/authentication');
var adminPermission = require('../middleware/adminPermission');

/* Authenticate a user */
router.post('/authenticate', UserController.authenticate);

/* Get data of current user */
router.get('/get', authentication, UserController.get);

/* Create a user */
router.post('/create', authentication, adminPermission, UserController.create);

/* Delete a user. Admin permission required */
router.delete('/delete', authentication, adminPermission, UserController.delete);

/* Register new account */
router.post('/register', UserController.register);

module.exports = router;