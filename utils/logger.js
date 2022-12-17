const winston = require('winston')
require('winston-daily-rotate-file')

// process.env.NODE_ENV === 'Production'
//     ?
let transport =
  process.env.NODE_ENV === 'Production'
    ? new winston.transports.DailyRotateFile({
        filename: 'logs/daily-log/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '10m',
        maxFiles: '7d',
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss',
          }),
          winston.format.printf(
            (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
          ),
          winston.format.printf(
            (info) =>
              `${info.label}:${info.level}: ${[info.timestamp]}: ${
                info.message
              }`
          )
        ),
      })
    : new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({
            all: true,
          }),
          winston.format.label({
            label: `🏷️`,
          }),
          winston.format.timestamp({
            format: 'HH:mm:ss',
          }),
          winston.format.printf(
            (info) =>
              `${info.label}:${info.level}: ${[info.timestamp]}: ${
                info.message
              }`
          )
        ),
      })

const logger = winston.createLogger({
  transports: [transport],
})

module.exports = logger
