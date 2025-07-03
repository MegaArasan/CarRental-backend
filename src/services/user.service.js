const { createToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');
const { createCsrfToken, hashToken } = require('../utils/helper');
const User = require('../../src/models/userModel');
const ErrorResponse = require('../errors/errorResponse');

const authenticatedUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ErrorResponse(404, 'User is not registered');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ErrorResponse(401, 'Invalid credentials');
    }

    const token = await createToken({
      userId: user._id,
      username: user.username,
      email: user.email,
      phoneno: user.phoneno,
      role: user.role
    });

    const csrfToken = createCsrfToken();
    const hashedCsrfToken = hashToken(csrfToken);

    return { token, hashedCsrfToken };
  } catch (error) {
    throw error;
  }
};

module.exports = { authenticatedUser };
