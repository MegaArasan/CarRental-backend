const winston = require('winston');
const dailyRotateFile = require('winston-daily-rotate-file');

const { align, colorize, combine, timestamp, printf } = winston.format;
const isVercelRuntime = Boolean(process.env.VERCEL);
const baseFormat = combine(
  colorize({ all: false }),
  timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
  align(),
  printf((info) => `[${info.timestamp}] ${info.level}: ${info.message || info.stack}`)
);

const transports = isVercelRuntime
  ? [new winston.transports.Console()]
  : [
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
    ];

const exceptionHandlers = isVercelRuntime
  ? [new winston.transports.Console()]
  : [
      new dailyRotateFile({
        filename: 'src/logs/%DATE%-exceptions.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '30d',
        maxSize: '20m'
      })
    ];

const logger = winston.createLogger({
  level: 'info',
  format: baseFormat,
  defaultMeta: { service: 'user-service' },
  transports,
  exceptionHandlers
});

module.exports = logger;
