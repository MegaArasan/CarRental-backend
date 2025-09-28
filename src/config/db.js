const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('./logger');
const { GridFSBucket } = require('mongodb');
const ErrorResponse = require('../errors/errorResponse');
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;
let bucket;

function connectdb() {
  mongoose.set('strictQuery', true);
  mongoose.connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  const connection = mongoose.connection;
  connection.once('open', () => {
    logger.info('MongoDb is connection successful');

    // initializing the bucket
    bucket = new GridFSBucket(connection.db, {
      bucketName: 'uploads'
    });

    logger.info('GridFS bucket initialized successfully');
  });
  connection.on('error', (e) => {
    logger.error('Mongo DB connection error');
    logger.error(e);
    throw new ErrorResponse(500, e);
  });
}

/**
 * Retrieves the initialized GridFSBucket instance for file storage.
 * Throws an error if the bucket has not been initialized yet.
 *
 * @function
 * @returns {GridFSBucket} The initialized GridFSBucket instance.
 * @throws {Error} If the GridFSBucket is not initialized.
 */
const getBucket = () => {
  if (!bucket) {
    throw new Error('GridFS Bucket not initialized yet');
  }
  return bucket;
};

module.exports = { connectdb, getBucket };
