const express = require('express');
const router = express.Router();
const {
  login,
  register,
  forgetPassword,
  resetPassword,
  logout,
  getUser,
  editUser,
  getAll
} = require('../controllers/user.controller');
const { validate, validateQuery } = require('../middlewares/joi.middleware');
const {
  loginSchema,
  registerSchema,
  editProfileSchema,
  getAllUsersSchema
} = require('../validations/user.schema');
const auth = require('../middlewares/auth.middleware');
const authorizedRoles = require('../middlewares/role.middleware');

router.post('/login', validate(loginSchema), login);

router.post('/register', validate(registerSchema), register);

router.post('/forgotpassword', forgetPassword);

router.post('/password-reset/:userId/:token', resetPassword);

router.post('/logout', logout);

router.get('/profile', auth, getUser);

router.put('/edit/:id', auth, validate(editProfileSchema), editUser);

router.get('/', auth, authorizedRoles('admin'), validateQuery(getAllUsersSchema), getAll);

module.exports = router;
