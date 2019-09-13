module.exports = ({ questionRepository, database }) => {
  const getOne = ({ id }) => {
    return Promise
      .resolve()
      .then(() => {
        return questionRepository.findOne({
          where: {
            id: id
          }
        })
      })
  }

  const getMultiple = ({ examId, courseId, subjectId, questionAmount }) => {
    return Promise
      .resolve()
      .then(() => {
        const questionList = questionRepository.findAll({
          where: {
            examId: examId,
            courseId: courseId,
            subjectId: subjectId
          },
          /* // TODO Think about fetching this in one different query
          include: [
            {
              model: database.models.examEntities
            },
            {
              model: database.models.courseEntities
            },
            {
              model: database.models.subjectEntities
            }
          ], */
          order: database.sequelize.random(),
          limit: questionAmount
        })
        return questionList
      })
  }

  const getBatchById = ({ idList }) => {
    return Promise
      .resolve()
      .then(() => {
        const questionList = questionRepository.findAll({
          where: {
            id: idList
          }
        })
        return questionList
      })
  }

  return {
    getOne,
    getMultiple,
    getBatchById
  }
}
