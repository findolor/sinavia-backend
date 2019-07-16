const colyseus = require('colyseus')
const log = require('../../logging/logger')
const config = require('../../../../config')
const logger = log({ config })

class ExamplePlayer {
  constructor (counter) {
    this.counter = counter
  }
}

class ExampleState {
  constructor () {
    this.players = {}
  }

  addPlayer (client) {
    this.players[ client.sessionId ] = new ExamplePlayer(0)
  }

  removePlayer (client) {
    delete this.players[ client.sessionId ]
  }

  addToCounter (client, action) {
    this.players[ client.sessionId ].counter += action
  }

  removeFromCounter (client, action) {
    this.players[client.sessionId].counter -= action
  }
}

class ExampleRoom extends colyseus.Room {
  onInit (options) {
    // TODO Get logger working in here. Somehow I cannot seem to make it work.
    logger.info(options)
    this.setState(new ExampleState())
  }
  onJoin (client, options) {
    // TODO Get logger working in here. Somehow I cannot seem to make it work.
    logger.info({
      clientId: client.id
    })
    this.state.addPlayer(client)
  }
  onMessage (client, data) {
    // TODO Get logger working in here. Somehow I cannot seem to make it work.
    logger.info(data)
    if (data.action === 'up') {
      this.state.addToCounter(client, 1)
    } else {
      this.state.removeFromCounter(client, 1)
    }
  }
  onLeave (client, consented) {
    // TODO Get logger working in here. Somehow I cannot seem to make it work.
    logger.info({
      message: 'Client leaving',
      clientId: client.id,
      consented: consented
    })
    this.state.removePlayer(client)
  }
  onDispose () {
    // TODO Get logger working in here. Somehow I cannot seem to make it work.
    logger.info('Room disposed')
  }
}

colyseus.serialize(colyseus.FossilDeltaSerializer)(ExampleRoom)

exports.exampleRoom = ExampleRoom
