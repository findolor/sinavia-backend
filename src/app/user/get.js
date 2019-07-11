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
        userRepository.getAll()
      )
      .catch(error => {
        throw new Error(error)
      })
  }

  return {
    all
  }
}
