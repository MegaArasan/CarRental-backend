const winston = require('winston');
const dailyRotateFile = require('winston-daily-rotate-file');

const { align, colorize, combine, timestamp, printf } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new dailyRotateFile({
      filename: 'src/logs/%DATE%-combined.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '14d',
      maxSize: '20m',
      level: 'info'
    }),
    new dailyRotateFile({
      filename: 'src/logs/%DATE%-error.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
      maxSize: '20m',
      level: 'error'
    })
  ],
  exceptionHandlers: [
    new dailyRotateFile({
      filename: 'src/logs/%DATE%-exceptions.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
      maxSize: '20m'
    })
  ]
});

module.exports = logger;
