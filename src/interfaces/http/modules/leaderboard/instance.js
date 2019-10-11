const container = require('src/container') // we have to get the DI
const { getLeaderboard } = require('src/app/leaderboard')
const { getUserScore } = require('src/app/userScore')
const Sequelize = require('sequelize')

module.exports = () => {
  const {
    repository: { leaderboardRepository },
    repository: { userScoreRepository },
    database
  } = container.cradle

  const getLeaderboardUseCase = getLeaderboard({ leaderboardRepository })
  const getUserScoreUseCase = getUserScore({ userScoreRepository, database, Sequelize })

  return {
    getLeaderboardUseCase,
    getUserScoreUseCase
  }
}
