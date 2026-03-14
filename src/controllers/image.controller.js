const { downloadFile } = require('../services/filestorage.service');
const FileAttachment = require('../models/attachmentModel');
const ErrorResponse = require('../errors/errorResponse');
const logger = require('../config/logger');

const getImageView = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attachment = await FileAttachment.findOne({
      $or: [
        {
          thumbnailFileId: id
        },
        {
          gridFsFileId: id
        }
      ]
    });

    let downloadStream;
    try {
      downloadStream = await downloadFile(id);
    } catch (err) {
      logger.error(err);
      throw new ErrorResponse(404, 'File stream not available');
    }

    res.setHeader('Content-Type', attachment.fileType);
    res.setHeader('Content-Disposition', `inline; filename="${attachment.fileName}"`);
    downloadStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getImageView
};
