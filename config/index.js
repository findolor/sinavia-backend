require('dotenv-flow').config({
  node_env: process.env.NODE_ENV || 'development'
})

const fs = require('fs')
const path = require('path')

function loadDbConfig () {
  if (fs.existsSync(path.join(__dirname, './database.js'))) {
    return require('./database')[ENV]
  }

  throw new Error('Database is configuration is required')
}

function loadAppConfig () {
  if (fs.existsSync(path.join(__dirname, './appConfig.js'))) {
    return require('./appConfig')
  }

  throw new Error('Application configuration is required')
}

function loadCacheConfig () {
  if (fs.existsSync(path.join(__dirname, './cache.js'))) {
    return require('./cache')[ENV]
  }

  throw new Error('Cache configuration is required')
}
const ENV = process.env.NODE_ENV || 'development'

const appConfig = loadAppConfig()
const dbConfig = loadDbConfig()
const cacheConfig = loadCacheConfig()

const config = Object.assign({
  env: ENV,
  db: dbConfig,
  cache: cacheConfig
}, appConfig)

module.exports = config
