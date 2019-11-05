module.exports = ({ server, database, gameEngine, logger, cronJob, reverseProxy }) => {
  return {
    start: () =>
      Promise
        .resolve()
        .then(database.authenticate)
        // Loads the ongoing matches from database
        .then(cronJob.loadOngoingMatchCrons)
        .then(server.start)
        .then(reverseProxy.startReverseProxy)
        // App comes from the reverse proxy server
        // It runs on 8080 and redirects /api/* to api server
        // Engine runs on 8080 too
        .then(app => gameEngine.start(app))
        // Gets the whole game content from db at 4 AM and puts it in cache
        .then(cronJob.makeGameContentCronJob)
        // Leaderboard cron job that runs at 4 AM
        .then(cronJob.leaderboardCronJob())
        .catch(err => logger.error(err.stack))
  }
}
