module.exports = ({ friendshipRepository, Sequelize }) => {
  const Op = Sequelize.Op

  const getFriendship = ({ userId, opponentId }) => {
    return Promise
      .resolve()
      .then(() => {
        const friendship = friendshipRepository.findAll({
          where: {
            [Op.or]: [
              {
                userId: userId,
                friendId: opponentId
              },
              {
                userId: opponentId,
                friendId: userId
              }
            ]
          }
        })
        return friendship
      })
      .catch(error => {
        throw new Error(error)
      })
  }

  const getFriends = ({ userId }) => {
    return Promise
      .resolve()
      .then(() => {
        const friends = friendshipRepository.findAll({
          where: {
            [Op.or]: [
              {
                userId: userId,
                friendshipStatus: 'approved'
              },
              {
                friendId: userId,
                friendshipStatus: 'approved'
              }
            ]
          }
        })
        return friends
      })
      .catch(error => {
        throw new Error(error)
      })
  }

  return {
    getFriendship,
    getFriends
  }
}
