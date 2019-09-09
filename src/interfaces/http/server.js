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

  return {
    app,
    start: () => new Promise((resolve) => {
      const http = app.listen(config.port, () => {
        const { port } = http.address()
        logger.info(`🤘 API - Port ${port}`)
        resolve(app)
      })
    })
  }
}
