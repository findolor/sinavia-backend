const container = require('src/container') // we have to get the DI
const { getStatistic } = require('src/app/statistic')

module.exports = () => {
  const { repository: {
    statisticRepository
  } } = container.cradle

  const getUseCase = getStatistic({ statisticRepository })

  return {
    getUseCase
  }
}
