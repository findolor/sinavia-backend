const http = require('http')
const colyseus = require('colyseus')
const monitor = require('@colyseus/monitor').monitor
const roomRegisterService = require('../../domain/gameEngine')

module.exports = ({ logger }) => {
  const port = process.env.ENGINE_PORT || 5000

  return {
    start: (app) => new Promise((resolve) => {
      const server = http.createServer(app)
      const gameEngine = new colyseus.Server({ server })

      const registeredGameEngine = roomRegisterService(gameEngine)

      app.use('/game', monitor(registeredGameEngine))

      registeredGameEngine.listen(port)
      logger.info(`Game Engine - Port ${port}`)
      resolve()
    })
  }
}
