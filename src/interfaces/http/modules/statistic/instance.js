const container = require('src/container') // we have to get the DI
const { getStatistic } = require('src/app/statistic')
const Sequelize = require('sequelize')

module.exports = () => {
  const { repository: {
    statisticRepository
  }
  } = container.cradle

  const getUseCase = getStatistic({ statisticRepository, Sequelize })

  return {
    getUseCase
  }
}
