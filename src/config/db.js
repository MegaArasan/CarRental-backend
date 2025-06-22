const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('./logger');
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

function connectdb() {
  mongoose.set('strictQuery', true);
  mongoose.connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  const connection = mongoose.connection;
  connection.on('connected', () => {
    logger.info('MongoDb is connection successful');
  });
  connection.on('error', (e) => {
    logger.error('Mongo DB connection error');
    logger.error(e);
  });
}

module.exports = connectdb;
