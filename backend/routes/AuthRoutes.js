
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthControllers');
const { authenticate } = require('../middlewares/authenticate');


router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/verify', AuthController.verifyOTP);
router.post('/resend', AuthController.resendOTP);
router.get('/google/callback', AuthController.googleCallback);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/forgot-password', AuthController.forgotPassword);

router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.me);

module.exports = router;