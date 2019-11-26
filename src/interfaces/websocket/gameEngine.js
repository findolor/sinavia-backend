const http = require('http')
const colyseus = require('colyseus')
const roomRegisterService = require('../../domain/gameEngine')

module.exports = ({ logger, config }) => {
  let port

  if (config.isProxyEnabled) port = Number(config.gameEnginePort) + Number(process.env.NODE_APP_INSTANCE)
  else port = config.gameEnginePort

  return {
    start: () => new Promise((resolve) => {
      const server = http.createServer()
      /* const gameEngine = new colyseus.Server({
        server: server
      }) */
      const gameEngine = new colyseus.Server()

      gameEngine.attach({ server: server })

      const registeredGameEngine = roomRegisterService(gameEngine)

      registeredGameEngine.listen(port)
      logger.info(`Game Engine - Port ${port}`)
      resolve()
    })
  }
}
