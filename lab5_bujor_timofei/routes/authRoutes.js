const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

router.get('/register', authController.registerForm);
router.post('/register', validateRegister, authController.register);
router.get('/login', authController.loginForm);
router.post('/login', validateLogin, authController.login);
router.post('/logout', authController.logout);          // выход только через POST
router.get('/profile', isAuthenticated, authController.profile);

module.exports = router;
