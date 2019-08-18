const log = require('src/infra/logging/logger')
const config = require('config/')
const logger = log({ config })
const rooms = require('./rooms')

module.exports = (gameEngine) => {
  gameEngine.register('rankedRoom', rooms.rankedRoom).then((handler) => {
    handler
      .on('create', (room) => logger.info(`room created: ${room.roomId}`))
      .on('dispose', (room) => logger.info(`room disposed: ${room.roomId}`))
      .on('join', (room, client) => logger.info(`${client.id} joined ${room.roomId}`))
      .on('leave', (room, client) => logger.info(`${client.id} left ${room.roomId}`))
  })

  gameEngine.register('groupRoom', rooms.groupRoom).then((handler) => {
    handler
      .on('create', (room) => logger.info(`room created: ${room.roomId}`))
      .on('dispose', (room) => logger.info(`room disposed: ${room.roomId}`))
      .on('join', (room, client) => logger.info(`${client.id} joined ${room.roomId}`))
      .on('leave', (room, client) => logger.info(`${client.id} left ${room.roomId}`))
  })

  return gameEngine
}
