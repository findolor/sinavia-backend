const container = require('src/container') // we have to get the DI
const { getOngoingMatch } = require('src/app/ongoingMatch')

module.exports = () => {
  const {
    repository: { ongoingMatchRepository },
    fcmService,
    database
  } = container.cradle

  const getOngoingMatchUseCase = getOngoingMatch({ ongoingMatchRepository, database })

  return {
    fcmService,
    getOngoingMatchUseCase
  }
}
