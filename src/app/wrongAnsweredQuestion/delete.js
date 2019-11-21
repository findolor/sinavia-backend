module.exports = ({ wrongAnsweredQuestionRepository }) => {
  const destroy = ({ userId, questionId }) => {
    return Promise.resolve().then(() => {
      return wrongAnsweredQuestionRepository.destroy({
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
