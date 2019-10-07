module.exports = ({ ongoingMatchRepository }) => {
  const remove = ({ id }) => {
    return Promise
      .resolve()
      .then(() =>
        ongoingMatchRepository.destroy({
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
