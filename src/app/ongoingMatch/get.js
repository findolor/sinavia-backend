module.exports = ({ ongoingMatchRepository, database }) => {
  const getOne = ({ id }) => {
    return Promise
      .resolve()
      .then(() => {
        return ongoingMatchRepository.findOne({
          where: {
            id: id
          },
          include: [
            {
              model: database.models.users,
              as: 'ongoingMatchUser'
            },
            {
              model: database.models.users,
              as: 'ongoingMatchFriend'
            },
            {
              model: database.models.statistics,
              as: 'ongoingMatchUserStatistics'
            },
            {
              model: database.models.statistics,
              as: 'ongoingMatchFriendStatistics'
            }
          ]
        })
      })
  }

  const getAll = () => {
    return Promise
      .resolve()
      .then(() => {
        return ongoingMatchRepository.findAll()
      })
  }

  const checkOngoingMatch = ({ userId, roomCode }) => {
    return Promise
      .resolve()
      .then(() => {
        return ongoingMatchRepository.findOne({
          where: {
            userId: userId,
            roomCode: roomCode
          }
        })
      })
  }

  return {
    getOne,
    getAll,
    checkOngoingMatch
  }
}
