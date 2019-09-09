const fs = require('fs')
const winston = require('winston')

if (!fs.existsSync(`logs`)) {
  fs.mkdirSync(`logs`)
}

module.exports = ({ config }) => {
  var transports = [
    new winston.transports.File(
      Object.assign(config.logging, {
        filename: `logs/${config.env}.log`
      })
    )
  ]
  if (config.env !== 'production') {
    transports.push(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }))
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
