const { Statistic } = require('src/domain/statistic')

module.exports = ({ statisticRepository }) => {
    const create = ({ gameResults }) => {
      return Promise
        .resolve()
        .then(() => {

            // TODO Actually make the object
            const statistic = Statistic(questionResults)

          return statisticRepository.create(statistic)
        })
        .catch(error => {
          throw new Error(error)
        })
    }
  
    return {
      create
    }
  }
  