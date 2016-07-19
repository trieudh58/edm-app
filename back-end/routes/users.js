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

/* Verify email with remember token */
router.get('/verify-email', UserController.verifyEmail);

/* Log out user - add current token to black list */
router.post('/logout', authentication, UserController.logOut);

module.exports = router;