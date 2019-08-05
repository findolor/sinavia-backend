require('dotenv-flow').config()

module.exports = {
  local: {
    redisPresenceUrl: process.env.REDIS_PRESENCE_URL
  }
}
