const express = require('express')
// const cors = require('cors')

module.exports = ({ config, router, logger, auth }) => {
  const app = express()

  app.disable('x-powered-by')
  // Colyseus migration caveats
  /* app.use(cors())
  app.use(express.json()) */

  app.use(auth.initialize())
  // We use versions
  // If the user's version is not correct
  // We don't let them play
  app.use(router)

  // we define our static folder
  app.use(express.static('public'))

  let port = 0

  if (config.isProxyEnabled) port = Number(config.port) + Number(process.env.NODE_APP_INSTANCE)
  else port = config.port

  return {
    app,
    start: () => new Promise((resolve) => {
      const http = app.listen(port, () => {
        const { port } = http.address()
        logger.info(`🤘 API - Port ${port}`)
        resolve(app)
      })
    })
  }
}
