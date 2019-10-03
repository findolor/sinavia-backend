
/**
 * We want to start here so we can manage other infrastructure
 * database
 * memcache
 * express server
 */
module.exports = ({ server, database, gameEngine, logger, cronJob }) => {
  return {
    start: () =>
      Promise
        .resolve()
        .then(database.authenticate)
        .then(server.start)
        .then(app => gameEngine.start(app))
        // Leaderboard cron job that runs at 4 AM (?)
        .then(cronJob.leaderboardCronJob())
        .catch(err => logger.error(err.stack))
  }
}
