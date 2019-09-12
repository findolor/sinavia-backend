const container = require('src/container') // we have to get the DI
const { getExamEntity } = require('src/app/examEntity')

module.exports = () => {
  const {
    repository: { examEntityRepository },
    database
  } = container.cradle

  const getExamEntityUseCase = getExamEntity({ examEntityRepository, database })

  return {
    getExamEntityUseCase
  }
}
