const express = require('express');
const router = express.Router();
const User = require('../../src/models/userModel');
const Token = require('../../src/models/token');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const { createToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User is not registered' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = await createToken({
      username: user.username,
      email: user.email,
      phoneno: user.phoneno
    });
    const { password: _, ...userData } = user._doc;

    res.status(200).json({ user: userData, token });
  } catch (e) {
    next(e);
  }
};

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
    res.status(200).json({ msg: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

const forgetPasseord = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({
        msg: 'Email is required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ msg: 'Email is not registered' });
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
    res.status(200).json({ msg: 'password reset link send to your email account' });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { password } = req.body;
  try {
    if (!password || password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid link or expired' });
    }

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token
    });
    if (!token) {
      return res.status(400).send('Invalid link or expired');
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    await user.save();
    await token.deleteOne();

    res.status(200).json({ msg: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  forgetPasseord,
  resetPassword
};
