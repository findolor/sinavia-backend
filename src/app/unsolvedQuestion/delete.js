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

  const deleteBatch = ({ userId, questionIdList }) => {
    return Promise.resolve().then(() => {
      return unsolvedQuestionRepository.destroy({
        where: {
          userId: userId,
          questionId: questionIdList
        }
      })
    })
  }

  return {
    destroy,
    deleteBatch
  }
}
