const container = require('src/container') // we have to get the DI
const { getUnsolvedQuestion } = require('src/app/unsolvedQuestion')

module.exports = () => {
  const {
    repository: { unsolvedQuestionRepository },
    database
  } = container.cradle

  const getUnsolvedQuestionUseCase = getUnsolvedQuestion({ unsolvedQuestionRepository, database })

  return {
    getUnsolvedQuestionUseCase
  }
}
