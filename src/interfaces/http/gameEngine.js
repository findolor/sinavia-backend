const http = require('http')
const colyseus = require('colyseus')
const express = require('express')
const monitor = require('@colyseus/monitor').monitor
const rooms = require('../../infra/gameEngine/rooms')

module.exports = ({ logger }) => {
  const port = 5000
  const app = express()

  const server = http.createServer(app)
  const gameEngine = new colyseus.Server({ server })

  gameEngine.register('exampleRoom', rooms.exampleRoom)

  app.use('/game', monitor(gameEngine))

  return {
    gameEngine,
    start: () => new Promise((resolve) => {
      gameEngine.listen(port)
      logger.info(`Game Engine - Port ${port}`)
      resolve()
    })
  }
}
