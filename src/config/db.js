const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('./logger');
const { GridFSBucket } = require('mongodb');

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
let bucket;
let connectionPromise;

async function connectdb() {
  if (!MONGO_URL) {
    throw new Error('MONGO_URL is not configured');
  }

  mongoose.set('strictQuery', true);

  if (mongoose.connection.readyState === 1 && bucket) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(MONGO_URL)
      .then((connection) => {
        const dbConnection = connection.connection;

        bucket = new GridFSBucket(dbConnection.db, {
          bucketName: 'uploads'
        });

        dbConnection.off('error', logConnectionError);
        dbConnection.on('error', logConnectionError);

        logger.info('MongoDb connection successful');
        logger.info('GridFS bucket initialized successfully');

        return dbConnection;
      })
      .catch((error) => {
        connectionPromise = null;
        logger.error('Mongo DB connection error');
        logger.error(error);
        throw error;
      });
  }

  return connectionPromise;
}

function logConnectionError(error) {
  logger.error('Mongo DB connection error');
  logger.error(error);
}

const getBucket = () => {
  if (!bucket) {
    throw new Error('GridFS Bucket not initialized yet');
  }
  return bucket;
};

module.exports = { connectdb, getBucket };
