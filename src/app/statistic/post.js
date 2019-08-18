const { Statistic } = require('src/domain/statistic')

module.exports = ({ statisticRepository }) => {
  const createStat = ({ gameResults }) => {
    return Promise
      .resolve()
      .then(() => {
        const statistic = Statistic(gameResults)

        return statisticRepository.create(statistic)
      })
  }

  return {
    createStat
  }
}
