module.exports = {
  version: process.env.APP_VERSION,
  port: process.env.PORT || 4000,
  timezone: process.env.TIMEZONE,
  logging: {
    maxsize: 100 * 1024, // 100mb
    maxFiles: 2,
    colorize: false
  },
  authSecret: process.env.SECRET,
  authSession: {
    session: false
  },
  gameEnginePort: process.env.GAME_ENGINE_PORT,
  isProxyEnabled: process.env.IS_PROXY_ENABLED === 'true'
}
