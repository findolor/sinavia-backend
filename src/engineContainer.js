const { createContainer, asValue, asFunction } = require('awilix')
// you can do this
const gameEngine = require('./interfaces/websocket/gameEngine')
const config = require('../config')
const logger = require('./infra/logging/logger')
const database = require('./infra/database')
const date = require('./infra/support/date')
const repository = require('./infra/repositories')
const fcm = require('./infra/pushNotifications')
const cron = require('./infra/cron')

const engineContainer = createContainer()

// SYSTEM
engineContainer
  .register({
    gameEngine: asFunction(gameEngine).singleton(),
    logger: asFunction(logger).singleton(),
    database: asFunction(database).singleton(),
    date: asFunction(date).singleton(),
    config: asValue(config),
    repository: asFunction(repository).singleton(),
    fcmService: asFunction(fcm).singleton(),
    cronJob: asFunction(cron).singleton()
  })

module.exports = engineContainer
