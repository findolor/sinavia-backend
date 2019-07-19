
/**
 * We want to start here so we can manage other infrastructure
 * database
 * memcache
 * express server
 */
module.exports = ({ server, database, gameEngine, logger }) => {
  return {
    start: () =>
      Promise
        .resolve()
        .then(database.authenticate)
        .then(server.start)
        .then(app => gameEngine.start(app))
        .catch(err => logger.error(err.stack))
  }
}
