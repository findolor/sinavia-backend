/**
  * function for getter user.
  */
module.exports = ({ userRepository, Sequelize }) => {
  const Op = Sequelize.Op

  // code for getting all the items
  const all = () => {
    return Promise
      .resolve()
      .then(() =>
      // TODO Add what attributes to get from the database. Right now it returns every attribute so this is obviously wrong.
        userRepository.findAll()
      )
      .catch(error => {
        throw new Error(error)
      })
  }

  const getOne = ({ id }) => {
    return Promise
      .resolve()
      .then(() => {
        return userRepository.findOne({
          where: {
            id: id
          },
          attributes: [
            'id', 'username', 'name', 'lastname', 'email', 'city', 'birthDate', 'profilePicture', 'coverPicture'
          ]
        })
      })
      .catch(error => {
        throw new Error(error)
      })
  }

  const getMultiple = ({ idList }) => {
    return Promise
      .resolve()
      .then(() => {
        const userList = userRepository.findAll({
          where: {
            id: idList
          }
        })
        return userList
      })
      .catch(error => {
        throw new Error(error)
      })
  }

  const getUserWithKeyword = ({ keyword, userId }) => {
    return Promise
      .resolve()
      .then(() => {
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
      .catch(error => {
        console.log(error)
        throw new Error(error)
      })
  }

  return {
    all,
    getOne,
    getMultiple,
    getUserWithKeyword
  }
}
