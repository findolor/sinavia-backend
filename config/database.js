const fs = require('fs')
require('dotenv-flow').config()

module.exports = {
  local: {
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    dialect: 'postgres',
    timezone: process.env.TIMEZONE,
    // ssl: process.env.DATABASE_SSL_ENABLED,
    dialectOptions: {
      /* ssl: {
        require: process.env.DATABASE_SSL_ENABLED
      }, */
      useUTC: false
    }
  },
  development: {
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    dialect: 'postgres',
    ssl: process.env.DATABASE_SSL_ENABLED,
    dialectOptions: {
      ssl: {
        require: process.env.DATABASE_SSL_ENABLED
      }
    }
  },
  test: {
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    dialect: 'postgres',
    ssl: process.env.DATABASE_SSL_ENABLED === 'true',
    dialectOptions: {
      ssl: {
        require: process.env.DATABASE_SSL_ENABLED === 'true',
        useUTC: false
      }
      // socketPath: process.env.SOCKET_PATH
    }
  },
  prod: {
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        // require: process.env.DATABASE_SSL_ENABLED,
        ca: fs.readFileSync('./secrets/server-ca.pem').toString(),
        key: fs.readFileSync('./secrets/client-key.pem').toString(),
        cert: fs.readFileSync('./secrets/client-cert.pem').toString()
      }
    }
  }
}
