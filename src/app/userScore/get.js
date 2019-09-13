module.exports = ({ userScoreRepository }) => {
  const getOne = ({ userId, examId, courseId, subjectId }) => {
    return Promise
      .resolve()
      .then(() => {
        const userScore = userScoreRepository.findOne({
          where: {
            userId: userId,
            examId: examId,
            courseId: courseId,
            subjectId: subjectId
          }
        })
        return userScore
      })
  }

  return {
    getOne
  }
}
