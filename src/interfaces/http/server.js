const express = require('express')
// const cors = require('cors')

module.exports = ({ config, router, logger, auth }) => {
  const app = express()

  app.disable('x-powered-by')
  // Colyseus migration caveats
  /* app.use(cors())
  app.use(express.json()) */

  app.use(auth.initialize())
  app.use(router)

  // we define our static folder
  app.use(express.static('public'))

  let port = 0

  if (config.isProxyEnabled) port = Number(config.port) + Number(process.env.NODE_APP_INSTANCE)
  else port = config.port

  return {
    app,
    start: () => new Promise((resolve) => {
      app.listen(port, () => {
        // logger.info(`🤘 API - Port ${port} ---> Cannot access normally. Only from our reverse proxy`)
        resolve(app)
      })
    })
  }
}
