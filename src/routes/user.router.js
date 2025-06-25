const express = require('express');
const router = express.Router();
const {
  login,
  register,
  forgetPassword,
  resetPassword
} = require('../../src/controllers/user.controller');
const { validate } = require('../middlewares/joi.middleware');
const { loginSchema } = require('../validations/user.schema');

router.post('/login', validate(loginSchema), login);

router.post('/register', register);

router.post('/forgotpassword', forgetPassword);

router.post('/password-reset/:userId/:token', resetPassword);

module.exports = router;
