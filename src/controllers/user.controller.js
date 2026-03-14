const User = require('../../src/models/userModel');
const Token = require('../../src/models/token');
const sendEmail = require('../utils/sendEmail');
const { createToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');
const { createCsrfToken, hashToken } = require('../utils/helper');
const {
  getAuthCookieOptions,
  getCsrfCookieOptions,
  getClearCookieOptions
} = require('../utils/cookies');
const {
  authenticatedUser,
  updateUser,
  getUserDtl,
  getAllUsers
} = require('../services/user.service');

/**
 * Authenticates a user with email and password.
 *
 * @async
 * @function login
 * @param {import('express').Request} req - Express request object containing user credentials in the body.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} Responds with user data and JWT token if authentication is successful, otherwise sends an error message.
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { token, csrfToken, hashedCsrfToken } = await authenticatedUser(email, password);

    res.cookie('token', token, getAuthCookieOptions());

    res.cookie('csrf_token', hashedCsrfToken, getCsrfCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Login successfully',
      csrfToken
    });
  } catch (e) {
    next(e);
  }
};

/**
 * Registers a new user with the provided details.
 *
 * @async
 * @function register
 * @param {import('express').Request} req - Express request object containing user registration details in the body.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} Responds with a success message and sets a JWT cookie if registration is successful, otherwise sends an error message.
 */
const register = async (req, res, next) => {
  const { email, password, address, phoneno, username } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({ success: false, message: 'Email already Registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newuser = new User({
      email,
      password: hashedPassword,
      address,
      phoneno,
      username
    });
    await newuser.save();
    const token = await createToken({
      userId: newuser._id,
      username,
      email,
      phoneno,
      role: 'customer'
    });
    res.cookie('token', token, getAuthCookieOptions());

    const csrfToken = createCsrfToken();
    const hashedCsrfToken = hashToken(csrfToken);
    res.cookie('csrf_token', hashedCsrfToken, getCsrfCookieOptions());

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      csrfToken
    });
  } catch (error) {
    next(error);
  }
};

const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const BASE_URL = process.env.BASE_URL;
  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email is not registered' });
    }

    //    Delete old tokens
    await Token.deleteMany({ userId: user._id });

    //    Create a new token with expiry
    const resetToken = await crypto.randomBytes(32).toString('hex');
    const hashedToken = await hashToken(resetToken);
    await new Token({
      userId: user._id,
      token: hashedToken,
      createdAt: new Date()
    }).save();

    const link = `${BASE_URL}/resetpassword/${user._id}/${resetToken}`;
    await sendEmail(user.email, link, user.username);
    res
      .status(200)
      .json({ success: true, message: 'password reset link send to your email account' });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { password } = req.body;
  try {
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid link or expired' });
    }
    const hashedFromURL = await hashToken(req.params.token);
    const token = await Token.findOne({
      userId: user._id,
      token: hashedFromURL
    });
    if (!token) {
      return res.status(400).json({ success: false, message: 'Invalid link or expired' });
    }

    if (token.createdAt.getTime() + 3600000 < Date.now()) {
      await token.deleteOne();
      return res.status(400).json({ success: false, message: 'Token expired' });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    await user.save();
    await token.deleteOne();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie('token', getClearCookieOptions({ httpOnly: true }));

    res.clearCookie('csrf_token', getClearCookieOptions({ httpOnly: false }));

    return res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const result = await getUserDtl(req.user.id);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const editUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Id is Mandatory' });
    }

    const user = await getUserDtl(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User Not Found' });
    }

    const data = req.body;

    await updateUser(id, data);

    return res.status(200).json({
      success: true,
      data: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    // Optional query params: page, limit, sort, role, isActive
    const { page, limit, sort, role, isActive } = req.query;

    const filters = {};
    if (role) {
      filters.role = role;
    }
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }

    const result = await getAllUsers({ page, limit, sort, filters });

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  forgetPassword,
  resetPassword,
  logout,
  getUser,
  editUser,
  getAll
};
