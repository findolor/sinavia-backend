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

  return {
    getJokers
  }
}
