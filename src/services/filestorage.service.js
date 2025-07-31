const { getBucket } = require('../config/db');
const { ObjectId } = require('mongodb');
const sharp = require('sharp');
const ErrorResponse = require('../errors/errorResponse');

const uploadFile = (file, providedBucket) =>
  new Promise(async (resolve, reject) => {
    try {
      const bucket = providedBucket || getBucket();

      const originalUpload = bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype
      });

      const thumbBuffer = await sharp(file.buffer).resize({ width: 300 }).jpeg().toBuffer();

      const thumbUpload = bucket.openUploadStream(`thumb-${file.originalname}`, {
        contentType: 'image/jpeg'
      });

      let originalFileId, thumbnailFileId;

      const check = () => {
        if (originalFileId && thumbnailFileId) {
          resolve({
            originalFileId: originalUpload.id,
            thumbnailFileId: thumbUpload.id
          });
        }
      };

      originalUpload.once('finish', () => {
        originalFileId = originalUpload.id;
        check();
      });
      thumbUpload.once('finish', () => {
        thumbnailFileId = thumbUpload.id;
        check();
      });

      originalUpload.on('error', reject);
      thumbUpload.on('error', reject);

      originalUpload.end(file.buffer);
      thumbUpload.end(thumbBuffer);
    } catch (err) {
      reject(new ErrorResponse(500, 'File upload failed'));
    }
  });

const downloadFile = async (fileId) => {
  if (!ObjectId.isValid(fileId)) {
    throw new ErrorResponse(400, 'Invalid file id');
  }
  return getBucket().openDownloadStream(new ObjectId(fileId));
};

/* ---------------- delete ------------------ */
const deleteFile = (fileId) => {
  if (!ObjectId.isValid(fileId)) {
    throw new ErrorResponse(400, 'Invalid file id');
  }
  return getBucket().delete(new ObjectId(fileId));
};

module.exports = { uploadFile, downloadFile, deleteFile };
