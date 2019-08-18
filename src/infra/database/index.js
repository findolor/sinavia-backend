const sequelize = require('src/infra/sequelize')

module.exports = ({ logger, config }) => {
  if (!config.db) {
    /* eslint-disable no-console */
    logger.error('Database config file log not found, disabling database.')
    /* eslint-enable no-console */
    return false
    /* TODO throw error instead boolean */
  }

  return sequelize({ config, basePath: __dirname })
}
