const express = require('express');
const { mongoIdValidator } = require('../validators/commonValidators');

const {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator
} = require('../validators/auth.validator');

const {
  signup,
  login,
  logout,
  forgotPassword,
  verifyPassResetCode,
  resetPassword
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.get('/logout', logout);
router.post('/forgotPassword', forgotPasswordValidator, forgotPassword);
router.post('/verifyResetCode/:token?', verifyResetCodeValidator, verifyPassResetCode);
router.put('/resetPassword', resetPasswordValidator, resetPassword);

module.exports = router;
