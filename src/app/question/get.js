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

  const getMultiple = ({ idList }) => {
    return Promise
      .resolve()
      .then(() => {
        const questionList = questionRepository.findAll({
          where: {
            id: idList
          }
        })
        return questionList
      })
      .catch(error => {
        throw new Error(error)
      })
  }

  return {
    getOne,
    getMultiple
  }
}
