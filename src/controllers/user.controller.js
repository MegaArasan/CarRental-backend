const express = require('express');
const router = express.Router();
const User = require('../../src/models/userModel');
const Token = require('../../src/models/token');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const { createToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');
const { createCsrfToken, hashToken } = require('../utils/helper');

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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User is not registered' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = await createToken({
      userId: user._id,
      username: user.username,
      email: user.email,
      phoneno: user.phoneno,
      role: user.role
    });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'strict'
    });

    const csrfToken = createCsrfToken();
    const hashedCsrfToken = hashToken(csrfToken);
    res.cookie('csrf_token', hashedCsrfToken, {
      httpOnly: false, // Frontend needs access
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ success: true, message: 'Login successfully' });
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
    if (!email || !password || !address || !phoneno || !username) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).send({ msg: 'Email already Registered' });
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
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'strict'
    });

    const csrfToken = createCsrfToken();
    const hashedCsrfToken = hashToken(csrfToken);
    res.cookie('csrf_token', hashedCsrfToken, {
      httpOnly: false, // Frontend needs access
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ success: false, message: 'Email is not registered' });
    }

    //    Delete old tokens
    await Token.deleteMany({ userId: user._id });

    //    Create a new token with expiry
    const resetToken = await createToken({ id: user._id }, '1h');
    await new Token({
      userId: user._id,
      token: resetToken,
      createdAt: new Date()
    }).save();

    const link = `https://kingcars-rental.netlify.app/resetpassword/${user._id}/${resetToken}`;
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

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token
    });
    if (!token) {
      return res.status(400).json({ success: false, message: 'Invalid link or expired' });
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
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });

    res.clearCookie('csrf_token', {
      httpOnly: false,
      secure: true,
      sameSite: 'strict'
    });

    return res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  register,
  forgetPassword,
  resetPassword,
  logout
};
