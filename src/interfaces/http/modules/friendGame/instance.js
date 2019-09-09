const container = require('src/container') // we have to get the DI

module.exports = () => {
  const {
    fcmService
  } = container.cradle

  return {
    fcmService
  }
}
