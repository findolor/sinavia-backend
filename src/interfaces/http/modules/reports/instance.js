const container = require('src/container') // we have to get the DI
const { postReportedUser } = require('src/app/reportedUser')
const { postReportedQuestion } = require('src/app/reportedQuestion')

module.exports = () => {
  const {
    repository: { reportedUserRepository },
    repository: { reportedQuestionRepository }
  } = container.cradle

  // const getReportedUserUseCase = getReportedUser({ reportedUserRepository })
  const postReportedUserUseCase = postReportedUser({ reportedUserRepository })
  const postReportedQuestionUseCase = postReportedQuestion({ reportedQuestionRepository })

  return {
    // getReportedUserUseCase,
    postReportedUserUseCase,
    postReportedQuestionUseCase
  }
}
