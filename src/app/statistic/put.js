const { Statistic } = require('src/domain/statistic')

module.exports = ({ statisticRepository }) => {
  const update = ({ statisticEntity }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const statistic = Statistic(statisticEntity)

        await statisticRepository.update(statistic, {
          where: {
            id: statistic.id
          }
        })

        resolve(statistic)
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    update
  }
}
