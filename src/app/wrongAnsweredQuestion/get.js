module.exports = ({ wrongAnsweredQuestionRepository, database }) => {
  const getBatch = ({ userId, examId, courseId, subjectId }) => {
    return Promise
      .resolve()
      .then(() => {
        const wrongAnsweredQuestions = wrongAnsweredQuestionRepository.findAll({
          where: {
            userId: userId
          },
          include: [
            {
              model: database.models.questions,
              where: {
                examId: examId,
                subjectId: subjectId,
                courseId: courseId
              }
            }
          ]
        })
        return wrongAnsweredQuestions
      })
  }

  return {
    getBatch
  }
}
