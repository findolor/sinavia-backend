const container = require('src/container')
const router = require('./router')
const instance = require('./instance')

module.exports = () => {
  const { logger, response: { Success, Fail }, jwt, auth } = container.cradle
  const app = instance()

  return {
    app,
    router: router({ logger, jwt, auth, response: { Success, Fail }, ...app })
  }
}
