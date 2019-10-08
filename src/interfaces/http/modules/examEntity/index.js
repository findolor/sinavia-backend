const container = require('src/container')
const router = require('./router')
const instance = require('./instance')

module.exports = () => {
  const { logger, response: { Success, Fail }, auth, nodeCache } = container.cradle
  const app = instance()

  return {
    app,
    router: router({ logger, auth, nodeCache, response: { Success, Fail }, ...app })
  }
}
