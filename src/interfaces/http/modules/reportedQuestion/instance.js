const container = require('src/container') // we have to get the DI
const { postReportedQuestion } = require('src/app/reportedQuestion')

module.exports = () => {
  const {
    repository: { reportedQuestionRepository }
  } = container.cradle

  const postReportedQuestionUseCase = postReportedQuestion({ reportedQuestionRepository })

  return {
    postReportedQuestionUseCase
  }
}
