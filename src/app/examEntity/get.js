module.exports = ({ examEntityRepository, database }) => {
  const getOne = ({ examId }) => {
    return Promise
      .resolve()
      .then(() => {
        const examEntity = examEntityRepository.findOne({
          where: {
            id: examId
          }
        })
        return examEntity
      })
  }

  const getFullExamInformation = ({ examId }) => {
    return Promise
      .resolve()
      .then(() => {
        const examEntity = examEntityRepository.findOne({
          where: {
            id: examId
          },
          include: [
            {
              model: database.models.courseEntities,
              include: [
                {
                  model: database.models.subjectEntities
                }
              ]
            }
          ]
        })
        return examEntity
      })
  }

  return {
    getOne,
    getFullExamInformation
  }
}
