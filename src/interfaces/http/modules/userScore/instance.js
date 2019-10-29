const container = require('src/container') // we have to get the DI
const { getUserScore } = require('src/app/userScore')

module.exports = () => {
  const {
    repository: { userScoreRepository }
  } = container.cradle

  const getUserScoreUseCase = getUserScore({ userScoreRepository })

  return {
    getUserScoreUseCase
  }
}
