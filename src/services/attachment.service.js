const ErrorResponse = require('../errors/errorResponse');
const FileAttachment = require('../models/attachmentModel');
const { uploadFile, downloadFile } = require('./filestorage.service');

const handleFileUpload = async (files, data, user) => {
  const attachments = [];
  const uploadedFiles = Object.values(files).flat();
  try {
    for (const file of uploadedFiles) {
      const { originalFileId: gridFsFileId, thumbnailFileId } = await uploadFile(file);

      const attachment = await FileAttachment.create({
        fileName: file.originalname,
        originalName: file.originalname,
        fileType: file.mimetype,
        size: file.size,
        uploadedBy: user.userId,
        storageType: 'GRIDFS',
        gridFsFileId,
        thumbnailFileId,
        relatedModel: data.type, // You can customize this later from req.body if needed
        relatedId: null, // relatedId is set to null initially. Later, link it via update when associating with User/Car/Booking.
        isLinked: false
      });
      attachments.push(attachment);
    }
    return attachments;
  } catch (error) {
    throw new ErrorResponse(500, error.message);
  }
};

const getFile = async (fileId) => {
  const attachment = await FileAttachment.findById(fileId);

  if (!attachment) {
    throw new ErrorResponse(404, 'File not found');
  }

  const downloadStream = downloadFile(attachment.gridFsFileId);
  return { attachment, downloadStream };
};

module.exports = {
  handleFileUpload,
  getFile
};
