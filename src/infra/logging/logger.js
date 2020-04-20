const fs = require('fs')
const winston = require('winston')
const { LoggingWinston } = require('@google-cloud/logging-winston')

if (!fs.existsSync(`logs`)) {
  fs.mkdirSync(`logs`)
}

const loggingWinston = new LoggingWinston({
  projectId: 'sinavia-deploy-test-258708',
  logName: 'sinavia-prod'
})

module.exports = ({ config }) => {
  var transports = [
    new winston.transports.File(
      Object.assign(config.logging, {
        filename: `logs/${config.env}.log`
      })
    )
  ]
  if (config.env !== 'prod') {
    transports.push(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }))
  } else {
    transports.push(loggingWinston)
  }
  // eslint-disable-next-line new-cap
  return new winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: transports
  })
}
