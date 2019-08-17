const http = require('http')
const colyseus = require('colyseus')
const monitor = require('@colyseus/monitor').monitor
const roomRegisterService = require('../../domain/gameEngine')

module.exports = ({ logger, config }) => {
  const port = config.gameEnginePort
  return {
    start: (app) => new Promise((resolve) => {
      const server = http.createServer(app)
      const gameEngine = new colyseus.Server({
        server,
        presence: new colyseus.RedisPresence({
          host: config.cache.host,
          port: config.cache.port,
          db: config.cache.db
        })
      })

      const registeredGameEngine = roomRegisterService(gameEngine)

      app.use('/game', monitor(registeredGameEngine))

      registeredGameEngine.listen(port)
      logger.info(`Game Engine - Port ${port}`)
      resolve()
    })
  }
}
