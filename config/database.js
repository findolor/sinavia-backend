/**
 * since mocha don't see enviroment variables we have to use dotenv
 */
require('dotenv-flow').config()

// TODO fix SSL issue
module.exports = {
  local: {
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    dialect: 'postgres'
    /* ssl: process.env.DATABASE_SSL_ENABLED,
    dialectOptions: {
      ssl: {
        require: process.env.DATABASE_SSL_ENABLED
      }
    } */
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
    ssl: process.env.DATABASE_SSL_ENABLED,
    dialectOptions: {
      ssl: {
        require: process.env.DATABASE_SSL_ENABLED,
        ssl: 'Amazon RDS'
      }
    }
  },
  production: {
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
  }
}
