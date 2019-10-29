const container = require('src/container') // we have to get the DI
const { getUserScore } = require('src/app/userScore')
const Sequelize = require('sequelize')

module.exports = () => {
  const {
    repository: { userScoreRepository },
    database
  } = container.cradle

  const getUserScoreUseCase = getUserScore({ userScoreRepository, database, Sequelize })

  return {
    getUserScoreUseCase
  }
}
