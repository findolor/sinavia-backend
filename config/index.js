require('dotenv-flow').config({
  node_env: process.env.NODE_ENV || 'local'
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
    return require('./cache')
  }

  throw new Error('Cache configuration is required')
}

function loadAWSConfig () {
  if (fs.existsSync(path.join(__dirname, './aws.js'))) {
    return require('./aws')
  }

  throw new Error('AWS is configuration is required')
}

const ENV = process.env.NODE_ENV || 'development'

const appConfig = loadAppConfig()
const dbConfig = loadDbConfig()
const cacheConfig = loadCacheConfig()
const awsConfig = loadAWSConfig()

const config = Object.assign({
  env: ENV,
  db: dbConfig,
  cache: cacheConfig,
  aws: awsConfig
}, appConfig)

if (!config.db) {
  throw new Error('db config file log not found')
}
if (!config.cache) {
  throw new Error('cache config file log not found')
}
if (!config.port) {
  throw new Error('app config file log not found')
}
if (!config.aws) {
  throw new Error('aws config file log not found')
}

module.exports = config
