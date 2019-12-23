module.exports = ({ userJokerRepository, database }) => {
  const getJokers = ({ userId }) => {
    return Promise
      .resolve()
      .then(() => {
        const userJoker = userJokerRepository.findAll({
          where: {
            userId: userId
          },
          include: [
            {
              model: database.models.jokers
            }
          ]
        })
        return userJoker
      })
  }

  const getOne = ({ userId, jokerId }) => {
    return Promise
      .resolve()
      .then(() => {
        const userJoker = userJokerRepository.findOne({
          where: {
            userId: userId,
            jokerId: jokerId
          },
          include: [
            {
              model: database.models.jokers
            }
          ]
        })
        return userJoker
      })
  }

  return {
    getJokers,
    getOne
  }
}
