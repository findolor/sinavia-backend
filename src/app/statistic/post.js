const { Statistic } = require('src/domain/statistic')

module.exports = ({ statisticRepository }) => {
  const createStat = ({ gameResults }) => {
    return Promise
      .resolve()
      .then(() => {
        const statistic = Statistic(gameResults)

        return statisticRepository.create(statistic)
      })
      .catch(error => {
        console.log(error)
        throw new Error(error)
      })
  }

  return {
    createStat
  }
}
