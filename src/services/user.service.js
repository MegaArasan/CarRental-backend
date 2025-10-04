const { createToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');
const { createCsrfToken, hashToken } = require('../utils/helper');
const User = require('../../src/models/userModel');
const ErrorResponse = require('../errors/errorResponse');
const FileAttachment = require('../models/attachmentModel');

const authenticatedUser = async (email, password) => {
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
};

const updateUser = async (id, data) => {
  const user = await User.findOne({ id });
  if (!user) {
    throw new ErrorResponse(404, 'User Not Found');
  }

  await User.updateOne({ id }, { $set: { ...data } });

  if (data.profile) {
    await FileAttachment.updateOne(
      { gridFsFileId: data.profile },
      {
        $set: {
          relatedModel: 'User',
          relatedId: id,
          isLinked: true
        }
      }
    );
  }

  return true;
};

const getUserDtl = async (id) => {
  const result = await User.findOne({ id });
  if (!result) {
    throw new ErrorResponse(404, 'User Not Found');
  }

  // Remove sensitive fields
  const userObj = result.toObject(); // convert Mongoose doc to plain object
  delete userObj.password;

  return userObj;
};

/**
 * Fetch all users with pagination, sorting, and optional filters
 * @param {Object} options - { page, limit, sort, filters }
 * @returns {Object} - { users, total, page, pages }
 */
const getAllUsers = async ({ page = 1, limit = 20, sort = '-createdAt', filters = {} }) => {
  page = parseInt(page);
  limit = parseInt(limit);

  const query = { ...filters };

  // Count total matching users
  const total = await User.countDocuments(query);

  // Calculate total pages
  const pages = Math.ceil(total / limit);

  // Fetch users
  const users = await User.find(query)
    .select('-password') // exclude password
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean(); // lean for performance

  return { users, total, page, pages };
};

module.exports = { authenticatedUser, updateUser, getUserDtl, getAllUsers };
