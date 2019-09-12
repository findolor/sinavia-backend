module.exports = ({ courseEntityRepository, database }) => {
  const getOne = ({ courseId }) => {
    return Promise
      .resolve()
      .then(() => {
        const courseEntity = courseEntityRepository.findOne({
          where: {
            id: courseId
          }
        })
        return courseEntity
      })
  }

  const getFullCourseInformation = ({ courseId }) => {
    return Promise
      .resolve()
      .then(() => {
        const courseEntity = courseEntityRepository.findOne({
          where: {
            id: courseId
          },
          include: [
            {
              model: database.models.subjectEntities
            }
          ]
        })
        return courseEntity
      })
  }

  return {
    getOne,
    getFullCourseInformation
  }
}
