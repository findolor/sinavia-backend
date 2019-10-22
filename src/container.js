const { createContainer, asValue, asFunction } = require('awilix')
// you can do this
const app = require('./app')
const gameEngine = require('./interfaces/websocket/gameEngine')
const server = require('./interfaces/http/server')
const router = require('./interfaces/http/router')
const auth = require('./interfaces/http/auth')
const config = require('../config')
const logger = require('./infra/logging/logger')
const database = require('./infra/database')
const jwt = require('./infra/jwt')
const response = require('./infra/support/response')
const date = require('./infra/support/date')
const repository = require('./infra/repositories')
const s3 = require('./infra/s3')
const fcm = require('./infra/pushNotifications')
const cron = require('./infra/cron')
const nodeCache = require('./infra/cache')
const smtp = require('./infra/smtp')

const container = createContainer()

// SYSTEM
container
  .register({
    app: asFunction(app).singleton(),
    gameEngine: asFunction(gameEngine).singleton(),
    server: asFunction(server).singleton(),
    router: asFunction(router).singleton(),
    logger: asFunction(logger).singleton(),
    database: asFunction(database).singleton(),
    auth: asFunction(auth).singleton(),
    jwt: asFunction(jwt).singleton(),
    response: asFunction(response).singleton(),
    date: asFunction(date).singleton(),
    config: asValue(config),
    repository: asFunction(repository).singleton(),
    s3service: asFunction(s3).singleton(),
    fcmService: asFunction(fcm).singleton(),
    cronJob: asFunction(cron).singleton(),
    nodeCache: asFunction(nodeCache).singleton(),
    smtpService: asFunction(smtp).singleton()
  })

module.exports = container
