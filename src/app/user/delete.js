/**
  * function for getter user.
  */
module.exports = ({ userRepository }) => {
  // code for getting all the items
  const remove = ({ id }) => {
    return Promise
      .resolve()
      .then(() =>
        userRepository.destroy({
          where: {
            id: id
          }
        })
      )
      .catch((error) => {
        throw error
      })
  }

  return {
    remove
  }
}
