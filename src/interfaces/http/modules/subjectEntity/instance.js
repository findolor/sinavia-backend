const container = require('src/container') // we have to get the DI
const { getSubjectEntity } = require('src/app/subjectEntity')

module.exports = () => {
  const {
    repository: { subjectEntityRepository },
    database
  } = container.cradle

  const getSubjectEntityUseCase = getSubjectEntity({ subjectEntityRepository, database })

  return {
    getSubjectEntityUseCase
  }
}
