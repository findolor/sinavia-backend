module.exports = ({ favouriteQuestionRepository, database }) => {
  const getBatch = ({ userId }) => {
    return Promise
      .resolve()
      .then(() => {
        const favouriteQuestions = favouriteQuestionRepository.findAll({
          where: {
            userId: userId
          },
          include: [database.models.questions]
        })
        return favouriteQuestions
      })
  }

  const getOne = ({ userId, questionId }) => {
    return Promise
      .resolve()
      .then(() => {
        return favouriteQuestionRepository.findOne({
          where: {
            userId: userId,
            questionId: questionId
          },
          include: [database.models.questions]
        })
      })
  }

  return {
    getBatch,
    getOne
  }
}
