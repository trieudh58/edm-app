var express = require('express');
var router = express.Router();
var UserController = require('../controllers/users');
var authentication = require('../middleware/authentication');
var validation = require('../validation/users');

/* Authenticate a user */
router.post('/authenticate', validation.authenticate, UserController.authenticate);

/* Get data of current user */
router.get('/get', authentication, UserController.get);

/* Register new account */
router.post('/register', validation.register, UserController.register);

/* Verify email with remember token */
router.put('/verify-email', validation.verifyEmail, UserController.verifyEmail);

/* Log out user - add current token to black list */
router.post('/logout', authentication, UserController.logOut);

module.exports = router;