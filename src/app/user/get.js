/**
 * function for getter user.
 */
module.exports = ({ userRepository, Sequelize }) => {
  const Op = Sequelize.Op

  // code for getting all the items
  const all = () => {
    return Promise.resolve().then(() =>
      // TODO Add what attributes to get from the database. Right now it returns every attribute so this is obviously wrong.
      userRepository.findAll()
    )
  }

  const getOne = ({ id }) => {
    return Promise.resolve().then(() => {
      return userRepository.findOne({
        where: {
          id: id
        },
        attributes: [
          'id',
          'username',
          'name',
          'lastname',
          'email',
          'city',
          'birthDate',
          'profilePicture',
          'coverPicture',
          'fcmToken'
        ]
      })
    })
  }

  const getMultiple = ({ idList }) => {
    return Promise.resolve().then(() => {
      const userList = userRepository.findAll({
        where: {
          id: idList
        }
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
        }
      })
      return searchedUsers
    })
  }

  return {
    all,
    getOne,
    getMultiple,
    getUserWithKeyword
  }
}
