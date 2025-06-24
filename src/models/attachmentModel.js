const { Schema } = require('mongoose');

const FileAttachmentSchema = new Schema(
  {
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    fileType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    storageType: { type: String, enum: ['LOCAL', 'S3', 'GRIDFS'], default: 'LOCAL' },
    filePath: { type: String },
    s3Key: { type: String },
    s3Bucket: { type: String },
    gridFsFileId: { type: Schema.Types.ObjectId },
    relatedModel: { type: String, required: true, enum: ['User', 'Car', 'Booking'], index: true },
    relatedId: { type: Schema.Types.ObjectId, required: true, refPath: 'relatedModel', index: true }
  },
  {
    timestamps: true
  }
);

FileAttachmentSchema.index({ relatedModel: 1, relatedId: 1 });

module.exports = mongoose.model('FileAttachment', FileAttachmentSchema);
