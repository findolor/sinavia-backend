module.exports = ({ subjectEntityRepository, database }) => {
  const getOne = ({ subjectId }) => {
    return Promise
      .resolve()
      .then(() => {
        const subjectEntity = subjectEntityRepository.findOne({
          where: {
            id: subjectId
          }
        })
        return subjectEntity
      })
  }

  const getFullSubjectInformation = ({ subjectId }) => {
    return Promise
      .resolve()
      .then(() => {
        const subjectEntity = subjectEntityRepository.findOne({
          where: {
            id: subjectId
          },
          include: [
            {
              model: database.models.courseEntities,
              include: [
                {
                  model: database.models.examEntities
                }
              ]
            }
          ]
        })
        return subjectEntity
      })
  }

  return {
    getOne,
    getFullSubjectInformation
  }
}
