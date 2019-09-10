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

  return {
    getBatch
  }
}
