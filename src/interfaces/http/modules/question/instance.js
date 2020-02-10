const container = require('src/container') // we have to get the DI
const { getQuestion } = require('src/app/question')

module.exports = () => {
  const {
    repository: { questionRepository },
    database
  } = container.cradle

  const getQuestionUseCase = getQuestion({ questionRepository, database })

  return {
    getQuestionUseCase
  }
}
