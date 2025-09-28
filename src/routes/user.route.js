const express = require('express');
const router = express.Router();
const {
  login,
  register,
  forgetPassword,
  resetPassword,
  logout,
  getUser,
  editUser
} = require('../controllers/user.controller');
const { validate } = require('../middlewares/joi.middleware');
const { loginSchema, registerSchema, editProfileSchema } = require('../validations/user.schema');
const auth = require('../middlewares/auth.middleware');

router.post('/login', validate(loginSchema), login);

router.post('/register', validate(registerSchema), register);

router.post('/forgotpassword', forgetPassword);

router.post('/password-reset/:userId/:token', resetPassword);

router.post('/logout', logout);

router.get('/profile', auth, getUser);

router.put('/edit/:id', auth, validate(editProfileSchema), editUser);

module.exports = router;
