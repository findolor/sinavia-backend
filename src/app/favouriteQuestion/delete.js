module.exports = ({ favouriteQuestionRepository }) => {
  const deleteOne = ({ userId, questionId }) => {
    return Promise.resolve().then(() => {
      return favouriteQuestionRepository.destroy({
        where: {
          userId: userId,
          questionId: questionId
        }
      })
    })
  }

  return {
    deleteOne
  }
}
