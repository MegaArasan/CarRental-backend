const ErrorResponse = require('../errors/errorResponse');
const FileAttachment = require('../models/attachmentModel');
const { uploadFile } = require('./filestorage.service');

const handleFileUpload = async (files, data, user) => {
  const attachments = [];
  const uploadedFiles = Object.values(files).flat();
  try {
    for (const file of uploadedFiles) {
      const { id: gridFsFileId } = await uploadFile(file);

      const attachment = await FileAttachment.create({
        fileName: file.originalname,
        originalName: file.originalname,
        fileType: file.mimetype,
        size: file.size,
        uploadedBy: user.userId,
        storageType: 'GRIDFS',
        gridFsFileId,
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

module.exports = {
  handleFileUpload
};
