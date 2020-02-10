const http = require('http')
const colyseus = require('colyseus')
const express = require('express')
const roomRegisterService = require('../../domain/gameEngine')
const cors = require('cors')

module.exports = ({ logger, config }) => {
  let port

  if (config.isProxyEnabled) port = Number(config.gameEnginePort) + Number(process.env.NODE_APP_INSTANCE)
  else port = config.gameEnginePort

  return {
    start: () => new Promise((resolve) => {
      const app = express()
      app.use(cors())
      app.use(express.json())

      const server = http.createServer(app)
      const gameEngine = new colyseus.Server({
        server: server
        /* presence: new colyseus.RedisPresence({
          url: "redis://127.0.0.1:6379/0"
        }) */
      })

      const registeredGameEngine = roomRegisterService(gameEngine)

      registeredGameEngine.listen(port)
      logger.info(`Game Engine - Port ${port}`)
      resolve()
    })
  }
}
