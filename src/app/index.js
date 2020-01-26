module.exports = ({ server, database, gameEngine, logger, cronJob }) => {
  return {
    startApi: () =>
      Promise
        .resolve()
        .then(database.authenticate)
        // Loads the ongoing matches from database
        .then(cronJob.loadOngoingMatchCrons)
        .then(server.start)
        // .then(app => gameEngine.start(app))
        // Gets the whole game content from db at 4 AM and puts it in cache
        .then(cronJob.makeGameContentCronJob)
        // Leaderboard cron job that runs at 4 AM
        .then(cronJob.leaderboardCronJob)
        // Cron job that runs every monday to delete user goals
        .then(cronJob.resetUserGoalsCronJob)
        .catch(err => logger.error(err.stack)),
    startEngine: () =>
      Promise
        .resolve()
        .then(gameEngine.start)
        .catch(err => logger.error(err.stack))
  }
}
