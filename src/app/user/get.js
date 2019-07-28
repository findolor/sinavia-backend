/**
  * function for getter user.
  */
module.exports = ({ userRepository }) => {
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
            'id', 'username', 'name', 'lastname', 'email', 'city', 'birthDate', 'profilePicture', 'coverPicture', 'isDeleted'
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

  return {
    all,
    getOne,
    getMultiple
  }
}
