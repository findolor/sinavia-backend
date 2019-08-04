const http = require('http')
const colyseus = require('colyseus')
const monitor = require('@colyseus/monitor').monitor
const roomRegisterService = require('../../domain/gameEngine')

module.exports = ({ logger }) => {
  const port = Number(process.env.ENGINE_PORT) || 5000 + Number(process.env.NODE_APP_INSTANCE)

  return {
    start: (app) => new Promise((resolve) => {
      const server = http.createServer(app)
      const gameEngine = new colyseus.Server({
        server,
        presence: new colyseus.RedisPresence({
          url: 'redis://127.0.0.1:6379/0'
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
