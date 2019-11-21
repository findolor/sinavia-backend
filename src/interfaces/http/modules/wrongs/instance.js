const container = require('src/container') // we have to get the DI
const { getWrongAnsweredQuestion } = require('src/app/wrongAnsweredQuestion')

module.exports = () => {
  const {
    repository: { wrongAnsweredQuestionRepository },
    database
  } = container.cradle

  const getWrongAnsweredQuestionUseCase = getWrongAnsweredQuestion({ wrongAnsweredQuestionRepository, database })

  return {
    getWrongAnsweredQuestionUseCase
  }
}
