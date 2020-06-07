const { ReportedQuestion } = require('src/domain/reportedQuestion')

module.exports = ({ reportedQuestionRepository }) => {
  const create = ({ body }) => {
    return Promise.resolve().then(() => {
      const reportedQuestion = ReportedQuestion(body)

      return reportedQuestionRepository.create(reportedQuestion)
    })
  }

  return {
    create
  }
}
