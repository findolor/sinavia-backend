const http = require('http')
const colyseus = require('colyseus')
const MongooseDriver = require('colyseus/lib/matchmaker/drivers/MongooseDriver').MongooseDriver
const express = require('express')
const roomRegisterService = require('../../domain/gameEngine')
const cors = require('cors')

module.exports = ({ logger, config }) => {
  let port = Number(config.gameEnginePort) + Number(process.env.NODE_APP_INSTANCE)

  return {
    start: () => new Promise((resolve) => {
      const app = express()
      app.use(cors())
      app.use(express.json())

      const server = http.createServer(app)
      const gameEngine = new colyseus.Server({
        server: server,
        presence: new colyseus.RedisPresence({
          url: 'redis://' + config.cache.host
        }),
        driver: new MongooseDriver()
      })

      const registeredGameEngine = roomRegisterService(gameEngine)

      registeredGameEngine.listen(port)
      logger.info(`Game Engine - Port ${port}`)
      resolve()
    })
  }
}
