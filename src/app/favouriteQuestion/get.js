module.exports = ({ favouriteQuestionRepository }) => {
  const getBatch = ({ userId }) => {
    return Promise
      .resolve()
      .then(() => {
        const favouriteQuestions = favouriteQuestionRepository.findAll({
          where: {
            userId: userId
          }
        })
        return favouriteQuestions
      })
  }

  return {
    getBatch
  }
}
