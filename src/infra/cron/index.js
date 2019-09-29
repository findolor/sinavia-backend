const cron = require('node-cron')

module.exports = () => {
  return {
    startJob: (
      second,
      minute,
      hour,
      dayOfMonth,
      month,
      dayOfWeek,
      callbackFunction,
      callbackFunctionParams
    ) => cron.schedule(`${second} ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`, () => {
      callbackFunction(callbackFunctionParams)
    })
    // TODO ADD CRON JOBS HERE LIKE
    // FRIEND GAME CRON
    // Save the friend game crons somewhere and if the game is resolved stop the job
    // LEADERBOARD CRON
    // Calculate the leaderboards at 4 AM maybe???
  }
}
