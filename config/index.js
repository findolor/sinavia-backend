require('dotenv-flow').config({
  node_env: process.env.NODE_ENV || 'local'
})

const fs = require('fs')
const path = require('path')

const admin = require('firebase-admin')

function loadDbConfig () {
  if (fs.existsSync(path.join(__dirname, './database.js'))) {
    return require('./database')[ENV]
  }

  throw new Error('Database is configuration is required')
}

function loadAppConfig () {
  if (fs.existsSync(path.join(__dirname, './app.js'))) {
    return require('./app')
  }

  throw new Error('Application configuration is required')
}

function loadCacheConfig () {
  if (fs.existsSync(path.join(__dirname, './cache.js'))) {
    return require('./cache')
  }

  throw new Error('Cache configuration is required')
}

function loadFCMConfig () {
  if (fs.existsSync(path.join(__dirname, './fcm.js'))) {
    return require('./fcm')[ENV]
  }

  throw new Error('FCM configuration is required')
}

function loadSMTPConfig () {
  if (fs.existsSync(path.join(__dirname, './smtp.js'))) {
    return require('./smtp')[ENV]
  }

  throw new Error('SMTP configuration is required')
}

const ENV = process.env.NODE_ENV || 'development'

const appConfig = loadAppConfig()
const dbConfig = loadDbConfig()
const cacheConfig = loadCacheConfig()
const fcmConfig = loadFCMConfig()
const smtpConfig = loadSMTPConfig()

admin.initializeApp({
  credential: admin.credential.cert(fcmConfig.serviceAccount),
  databaseURL: fcmConfig.databaseURL
})

fcmConfig.firebaseAdmin = admin

const config = Object.assign({
  env: ENV,
  db: dbConfig,
  cache: cacheConfig,
  fcm: fcmConfig,
  smtp: smtpConfig
}, appConfig)

if (!config.db) {
  throw new Error('db config file log not found')
}
if (!config.cache) {
  throw new Error('cache config file log not found')
}
if (!config.apiPort) {
  throw new Error('app config file log not found')
}
if (!config.fcm) {
  throw new Error('fcm config file log not found')
}
if (!config.smtp) {
  throw new Error('smtp config file log not found')
}

module.exports = config
