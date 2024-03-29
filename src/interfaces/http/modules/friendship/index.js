const container = require('src/container')
const router = require('./router')
const instance = require('./instance')

module.exports = () => {
  const { logger, response: { Success, Fail }, auth, config } = container.cradle
  const app = instance()

  return {
    app,
    router: router({ logger, auth, config, response: { Success, Fail }, ...app })
  }
}
