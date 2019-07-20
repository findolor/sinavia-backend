module.exports = ({ questionRepository }) => {
  const getOne = ({ id }) => {
    return Promise
      .resolve()
      .then(() => {
        return questionRepository.findOne({
          where: {
            id: id
          }
        })
      })
      .catch(error => {
        throw new Error(error)
      })
  }

  return {
    getOne
  }
}
