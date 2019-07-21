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
    const questionList = []
    return Promise
      .resolve()
      .then(() => {
        idList.forEach(element => {
          const question = questionRepository.findOne({
            where: {
              id: element
            }
          })
          questionList.push(question)
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
