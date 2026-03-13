/**
 * File Service – Production Ready
 * Handles upload, thumbnail generation, download, and delete using MongoDB GridFS.
 */

const { getBucket } = require('../config/db');
const { ObjectId } = require('mongodb');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const ErrorResponse = require('../errors/errorResponse');

// Allowed MIME types (add/remove as needed)
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_MB = 10; // 10 MB limit

/**
 * Upload file and thumbnail
 * @param {Object} file - Multer file object
 * @param {GridFSBucket} [providedBucket] - Optional MongoDB bucket
 * @returns {Promise<{originalFileId, thumbnailFileId}>}
 */
const uploadFile = async (file, providedBucket) => {
  try {
    if (!file || !file.buffer) {
      throw new ErrorResponse(400, 'No file provided');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new ErrorResponse(400, `Invalid file type: ${file.mimetype}`);
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      throw new ErrorResponse(400, `File exceeds ${MAX_FILE_SIZE_MB}MB size limit`);
    }

    const bucket = providedBucket || getBucket();
    const uniqueName = `${uuidv4()}-${file.originalname}`;

    // Create thumbnail buffer
    const thumbBuffer = await sharp(file.buffer)
      .resize({ width: 300 })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Helper to stream upload to GridFS
    const uploadToGridFS = (buffer, filename, contentType) =>
      new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(filename, { contentType });
        uploadStream.once('finish', () => resolve(uploadStream.id));
        uploadStream.once('error', reject);
        uploadStream.end(buffer);
      });

    // Upload original & thumbnail in parallel
    const [originalFileId, thumbnailFileId] = await Promise.all([
      uploadToGridFS(file.buffer, uniqueName, file.mimetype),
      uploadToGridFS(thumbBuffer, `thumb-${uniqueName}`, 'image/jpeg')
    ]);

    return { originalFileId, thumbnailFileId };
  } catch (err) {
    console.error('File Upload Error:', err);
    if (err instanceof ErrorResponse) {
      throw err;
    }
    throw new ErrorResponse(500, 'File upload failed');
  }
};

/**
 * Download file stream by ID
 * @param {string} fileId
 * @returns {GridFSBucketReadStream}
 */
const downloadFile = (fileId) => {
  if (!ObjectId.isValid(fileId)) {
    throw new ErrorResponse(400, 'Invalid file ID');
  }

  const bucket = getBucket();
  const stream = bucket.openDownloadStream(new ObjectId(fileId));

  stream.on('error', (err) => {
    console.error('File Download Error:', err);
    throw new ErrorResponse(404, 'File not found');
  });

  return stream;
};

/**
 * Delete file by ID
 * @param {string} fileId
 * @returns {Promise<void>}
 */
const deleteFile = async (fileId) => {
  if (!ObjectId.isValid(fileId)) {
    throw new ErrorResponse(400, 'Invalid file ID');
  }

  try {
    const bucket = getBucket();
    await bucket.delete(new ObjectId(fileId));
  } catch (err) {
    console.error('File Delete Error:', err);
    throw new ErrorResponse(500, 'File deletion failed');
  }
};

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile
};
