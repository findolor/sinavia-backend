const log = require('src/infra/logging/logger')
const config = require('config/')
const logger = log({ config })
const rooms = require('./rooms')

// TODO Migrate Colyseus from 0.10.8 to 0.11.0
// Rn it has some probs with react native client

module.exports = (gameEngine) => {
  // .filterBy(['examName', 'subjectName', 'courseName'])
  gameEngine.register('rankedRoom', rooms.rankedRoom).then(handler => {
    handler
      .on('create', (room) => logger.info(`room created: ${room.roomId}`))
      .on('dispose', (room) => logger.info(`room disposed: ${room.roomId}`))
      .on('join', (room, client) => logger.info(`${client.id} joined ${room.roomId}`))
      .on('leave', (room, client) => logger.info(`${client.id} left ${room.roomId}`))
  })

  // .filterBy(['roomCode'])
  gameEngine.register('groupRoom', rooms.groupRoom).then(handler => {
    handler
      .on('create', (room) => logger.info(`room created: ${room.roomId}`))
      .on('dispose', (room) => logger.info(`room disposed: ${room.roomId}`))
      .on('join', (room, client) => logger.info(`${client.id} joined ${room.roomId}`))
      .on('leave', (room, client) => logger.info(`${client.id} left ${room.roomId}`))
  })

  // .filterBy(['roomCode'])
  gameEngine.register('friendRoom', rooms.friendRoom).then(handler => {
    handler
      .on('create', (room) => logger.info(`room created: ${room.roomId}`))
      .on('dispose', (room) => logger.info(`room disposed: ${room.roomId}`))
      .on('join', (room, client) => logger.info(`${client.id} joined ${room.roomId}`))
      .on('leave', (room, client) => logger.info(`${client.id} left ${room.roomId}`))
  })

  return gameEngine
}
