const { OngoingMatch } = require('src/domain/ongoingMatch')

module.exports = ({ ongoingMatchRepository }) => {
  const update = ({ ongoingMatchEntity }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const ongoingMatch = OngoingMatch(ongoingMatchEntity)

        await ongoingMatchRepository.update(ongoingMatch, {
          where: {
            id: ongoingMatchEntity.id
          }
        })

        resolve(ongoingMatch)
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    update
  }
}
