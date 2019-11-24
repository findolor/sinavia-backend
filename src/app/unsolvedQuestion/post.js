const { UnsolvedQuestion } = require('src/domain/unsolvedQuestion')

module.exports = ({ unsolvedQuestionRepository }) => {
  const create = ({ unsolvedQuestionEntity }) => {
    return Promise.resolve().then(() => {
      const unsolvedQuestion = UnsolvedQuestion(unsolvedQuestionEntity)

      return unsolvedQuestionRepository.create(unsolvedQuestion)
    })
  }

  return {
    create
  }
}
