const log = require('src/infra/logging/logger')
const config = require('config/')
const logger = log({ config })
const rooms = require('./rooms')

module.exports = (gameEngine) => {
  gameEngine.define('rankedRoom', rooms.rankedRoom)
    .filterBy(['examId', 'subjectId', 'courseId'])
    .sortBy({ clients: 'ascending' })
    .on('create', (room) => logger.info(`room created: ${room.roomId}`))
    .on('dispose', (room) => logger.info(`room disposed: ${room.roomId}`))
    .on('join', (room, client) => logger.info(`${client.id} joined ${room.roomId}`))
    .on('leave', (room, client) => logger.info(`${client.id} left ${room.roomId}`))

  gameEngine.define('groupRoom', rooms.groupRoom)
    .filterBy(['roomCode'])
    .sortBy({ clients: 'ascending' })
    .on('create', (room) => logger.info(`room created: ${room.roomId}`))
    .on('dispose', (room) => logger.info(`room disposed: ${room.roomId}`))
    .on('join', (room, client) => logger.info(`${client.id} joined ${room.roomId}`))
    .on('leave', (room, client) => logger.info(`${client.id} left ${room.roomId}`))

  gameEngine.define('friendRoom', rooms.friendRoom)
    .filterBy(['roomCode'])
    .sortBy({ clients: 'ascending' })
    .on('create', (room) => logger.info(`room created: ${room.roomId}`))
    .on('dispose', (room) => logger.info(`room disposed: ${room.roomId}`))
    .on('join', (room, client) => logger.info(`${client.id} joined ${room.roomId}`))
    .on('leave', (room, client) => logger.info(`${client.id} left ${room.roomId}`))

  gameEngine.define('friendSoloRoom', rooms.friendSoloRoom)
    .filterBy(['roomCode'])
    .on('create', (room) => logger.info(`room created: ${room.roomId}`))
    .on('dispose', (room) => logger.info(`room disposed: ${room.roomId}`))
    .on('join', (room, client) => logger.info(`${client.id} joined ${room.roomId}`))
    .on('leave', (room, client) => logger.info(`${client.id} left ${room.roomId}`))

  gameEngine.define('soloModeRoom', rooms.soloModeRoom)
    .on('create', (room) => logger.info(`room created: ${room.roomId}`))
    .on('dispose', (room) => logger.info(`room disposed: ${room.roomId}`))
    .on('join', (room, client) => logger.info(`${client.id} joined ${room.roomId}`))
    .on('leave', (room, client) => logger.info(`${client.id} left ${room.roomId}`))

  gameEngine.define('unsolvedModeRoom', rooms.unsolvedQuestionsRoom)
    .on('create', (room) => logger.info(`room created: ${room.roomId}`))
    .on('dispose', (room) => logger.info(`room disposed: ${room.roomId}`))
    .on('join', (room, client) => logger.info(`${client.id} joined ${room.roomId}`))
    .on('leave', (room, client) => logger.info(`${client.id} left ${room.roomId}`))

  return gameEngine
}
