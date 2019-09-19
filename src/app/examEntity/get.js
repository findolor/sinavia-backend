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

  const getAll = () => {
    return Promise
      .resolve()
      .then(() => {
        return examEntityRepository.findAll({
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
    getAll,
    getFullExamInformation
  }
}
