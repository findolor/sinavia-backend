/**
 * since mocha don't see enviroment variables we have to use dotenv
 */

module.exports = {
  local: {
    url: process.env.DATABASE_URL,
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
  development: {
    url: process.env.DATABASE_URL,
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
    url: process.env.DATABASE_URL,
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
  production: {
    url: process.env.DATABASE_URL,
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
