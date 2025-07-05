const { handleFileUpload } = require('../services/attachment.service');

const add = async (req, res, next) => {
  try {
    if (req.files) {
      const result = await handleFileUpload(req.files, req.body, req.user);

      res.status(201).json({
        success: true,
        message: 'Files uploaded successfully',
        data: result
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { add };
