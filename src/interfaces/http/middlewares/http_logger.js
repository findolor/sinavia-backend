const morgan = require('morgan')

module.exports = (logger) => {
  // TODO use winston
  return morgan('common', {
    stream: {
      write: (message) => {
        logger.info(message.slice(0, -1))
      }
    }
  })
}
