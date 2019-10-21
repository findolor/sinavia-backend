/**
 * function for getter user.
 */
module.exports = ({ userRepository, Sequelize, database }) => {
  const Op = Sequelize.Op

  const getOne = ({ id }) => {
    return Promise.resolve().then(() => {
      return userRepository.findOne({
        where: {
          id: id
        },
        attributes: { exclude: ['password'] }
      })
    })
  }

  const getOpponentFullInformation = ({ userId }) => {
    return Promise.resolve().then(() => {
      return userRepository.findOne({
        where: {
          id: userId
        },
        attributes: { exclude: ['password'] },
        include: [
          {
            model: database.models.friendships,
            as: 'user'
          },
          {
            model: database.models.friendships,
            as: 'friend'
          },
          {
            model: database.models.userScores
          }
        ]
      })
    })
  }

  const getMultiple = ({ idList }) => {
    return Promise.resolve().then(() => {
      const userList = userRepository.findAll({
        where: {
          id: idList
        },
        attributes: { exclude: ['password'] }
      })
      return userList
    })
  }

  const getUserWithKeyword = ({ keyword, userId }) => {
    return Promise.resolve().then(() => {
      const searchedUsers = userRepository.findAll({
        where: {
          [Op.and]: [
            {
              username: {
                [Op.iLike]: `%${keyword}%`
              }
            },
            {
              id: {
                [Op.ne]: userId
              }
            }
          ]
        },
        attributes: { exclude: ['password'] }
      })
      return searchedUsers
    })
  }

  return {
    getOne,
    getMultiple,
    getUserWithKeyword,
    getOpponentFullInformation
  }
}
