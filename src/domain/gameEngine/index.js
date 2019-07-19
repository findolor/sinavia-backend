const rooms = require('./rooms')

module.exports = (gameEngine) => {
  gameEngine.register('rankedRoom', rooms.rankedRoom).then((handler) => {
    handler
      .on('create', (room) => console.log('room created:', room.roomId))
      .on('dispose', (room) => console.log('room disposed:', room.roomId))
      .on('join', (room, client) => console.log(client.id, 'joined', room.roomId))
      .on('leave', (room, client) => console.log(client.id, 'left', room.roomId))
  })

  return gameEngine
}
