module.exports = ({ friendsMatchRepository, Sequelize }) => {
  const Op = Sequelize.Op

  const getMatches = ({ userId, friendId }) => {
    return Promise
      .resolve()
      .then(() => {
        const matches = friendsMatchRepository.findAll({
          where: {
            [Op.or]: [
              {
                winnerId: userId,
                loserId: friendId
              },
              {
                loserId: userId,
                winnerId: friendId
              }
            ]
          }
        })
        return matches
      })
  }

  return {
    getMatches
  }
}
