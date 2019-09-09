module.exports = ({ friendshipRepository, Sequelize }) => {
  const Op = Sequelize.Op

  const getFriendship = ({ userId, friendId }) => {
    return Promise
      .resolve()
      .then(() => {
        const friendship = friendshipRepository.findAll({
          where: {
            [Op.or]: [
              {
                userId: userId,
                friendId: friendId
              },
              {
                userId: friendId,
                friendId: userId
              }
            ]
          }
        })
        return friendship
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
  }

  const getFriendRequests = ({ userId }) => {
    return Promise
      .resolve()
      .then(() => {
        const requestedFriends = friendshipRepository.findAll({
          where: {
            friendId: userId,
            friendshipStatus: 'requested'
          }
        })
        return requestedFriends
      })
  }

  return {
    getFriendship,
    getFriends,
    getFriendRequests
  }
}
