const container = require('src/container') // we have to get the DI
const { getCourseEntity } = require('src/app/courseEntity')

module.exports = () => {
  const {
    repository: { courseEntityRepository },
    database
  } = container.cradle

  const getCourseEntityUseCase = getCourseEntity({ courseEntityRepository, database })

  return {
    getCourseEntityUseCase
  }
}
