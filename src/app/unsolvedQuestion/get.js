module.exports = ({ unsolvedQuestionRepository, database }) => {
  const getBatch = ({ userId, examId, courseId, subjectId, questionAmount }) => {
    return Promise
      .resolve()
      .then(() => {
        const unsolvedQuestions = unsolvedQuestionRepository.findAll({
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
          ],
          order: database.sequelize.random(),
          limit: questionAmount
        })
        return unsolvedQuestions
      })
  }

  return {
    getBatch
  }
}
