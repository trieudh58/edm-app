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

/* Change password */
router.put('/change-password', validation.changePassoword, authentication, UserController.changePassword);

/* Update interests */
router.put('/update-interests', validation.updateInterests, authentication, UserController.updateInterests);

module.exports = router;