const { getBucket } = require('../config/db');
const { ObjectId } = require('mongodb');
const ErrorResponse = require('../errors/errorResponse');

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype
    });

    uploadStream.end(file.buffer);
    uploadStream.on('finish', () => {
      resolve({
        id: uploadStream.id
      });
    });

    uploadStream.on('error', (err) => {
      reject(new ErrorResponse(500, 'File Upload failed'));
    });
  });
};

const downloadFile = (fileId) => {
  if (!ObjectId.isValid(fileId)) {
    throw new ErrorResponse(400, 'Invalid file id');
  }
  const bucket = getBucket();
  const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));

  return downloadStream;
};

const deleteFile = (fileId) => {
  if (!ObjectId.isValid(fileId)) {
    throw new ErrorResponse(400, 'Invalid file id');
  }
  const bucket = getBucket();
  return bucket.delete(new ObjectId(fileId));
};

module.exports = { uploadFile, deleteFile, downloadFile };
