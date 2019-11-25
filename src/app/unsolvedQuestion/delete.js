module.exports = ({ unsolvedQuestionRepository }) => {
  const destroy = ({ userId, questionId }) => {
    return Promise.resolve().then(() => {
      return unsolvedQuestionRepository.destroy({
        where: {
          userId: userId,
          questionId: questionId
        }
      })
    })
  }

  return {
    destroy
  }
}
