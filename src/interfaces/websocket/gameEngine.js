const http = require('http')
const colyseus = require('colyseus')
const mongoose = require('mongoose')
const roomRegisterService = require('../../domain/gameEngine')

module.exports = ({ logger, config }) => {
  let port
  let mongoDb
  if (config.isProxyEnabled) port = Number(config.gameEnginePort) + Number(process.env.NODE_APP_INSTANCE)
  else port = config.gameEnginePort

  mongoose.connect('mongodb://localhost:27017', (err) => {
    if (err) throw err
    mongoDb = mongoose.connection.db // <-- This is your MongoDB driver instance.
  })

  return {
    start: (app) => new Promise((resolve) => {
      const server = http.createServer(app)
      const gameEngine = new colyseus.Server({
        server: server,
        // Presence and mongoose driver is used for scalability
        presence: new colyseus.RedisPresence({
          url: 'redis://' + config.cache.host
        }),
        driver: mongoDb
        // TODO migrate colyseus
        /* presence: new colyseus.RedisPresence({
          host: config.cache.host,
          port: config.cache.port,
          db: config.cache.db
        }), */
        // express: app
      })

      const registeredGameEngine = roomRegisterService(gameEngine)

      registeredGameEngine.listen(port)
      logger.info(`Game Engine - Port ${port}`)
      resolve()
    })
  }
}
