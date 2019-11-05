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
  isProxyEnabled: process.env.IS_PROXY_ENABLED === 'true',
  reverseProxyPort: process.env.REVERSE_PROXY_PORT,
  apiUrl: process.env.API_URL
}
