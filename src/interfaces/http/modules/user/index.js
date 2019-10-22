const container = require('src/container')
const router = require('./router')
const instance = require('./instance')

module.exports = () => {
  const { logger, response: { Success, Fail }, auth, smtpService, config } = container.cradle
  const app = instance()

  return {
    app,
    router: router({ logger, auth, smtpService, config, response: { Success, Fail }, ...app })
  }
}
