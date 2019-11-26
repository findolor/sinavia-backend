module.exports = ({ server, database, gameEngine, logger, cronJob }) => {
  return {
    start: () =>
      Promise
        .resolve()
        .then(database.authenticate)
        // Loads the ongoing matches from database
        .then(cronJob.loadOngoingMatchCrons)
        .then(server.start)
        .then(gameEngine.start)
        // Gets the whole game content from db at 4 AM and puts it in cache
        .then(cronJob.makeGameContentCronJob)
        // Leaderboard cron job that runs at 4 AM
        .then(cronJob.leaderboardCronJob())
        .catch(err => logger.error(err.stack))
  }
}
