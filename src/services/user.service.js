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
  const oldProfileId = user.profile || null;

  // 3️⃣ Update user FIRST (source of truth)
  const updatedUser = await User.findByIdAndUpdate(id, { $set: data }, { new: true });

  // 4️⃣ Handle profile image linking (best-effort)
  if (data.profile) {
    // Unlink old profile image
    if (oldProfileId && oldProfileId !== data.profile) {
      await FileAttachment.updateOne(
        { gridFsFileId: oldProfileId },
        { $set: { isLinked: false, relatedId: null } }
      );
    }

    // Link new profile image
    const result = await FileAttachment.updateOne(
      { gridFsFileId: data.profile },
      {
        $set: {
          relatedModel: 'User',
          relatedId: id,
          isLinked: true
        }
      }
    );

    // 🔴 Safety fallback
    if (result.matchedCount === 0) {
      // rollback profile field
      await User.findByIdAndUpdate(id, {
        $set: { profile: oldProfileId }
      });

      throw new ErrorResponse(400, 'Invalid profile image');
    }
  }

  // 5️⃣ Prepare response
  const baseUrl = process.env.BASE_URL;
  const userObj = updatedUser.toObject();
  delete userObj.password;

  return {
    ...userObj,
    profile: userObj.profile ? `${baseUrl}/api/v1/image/${userObj.profile}` : null
  };
};

const getUserDtl = async (id) => {
  const userObj = await User.findOne({ id }).lean();
  if (!userObj) {
    throw new ErrorResponse(404, 'User Not Found');
  }

  delete userObj.password;
  const baseUrl = process.env.BASE_URL;

  return {
    ...userObj,
    profile: userObj.profile ? `${baseUrl}/api/v1/image/${userObj.profile}` : null
  };
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
