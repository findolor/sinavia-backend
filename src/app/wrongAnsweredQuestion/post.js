const { WrongAnsweredQuestion } = require('src/domain/wrongAnsweredQuestion')

module.exports = ({ wrongAnsweredQuestionRepository }) => {
  const create = ({ wrongAnsweredQuestionEntity }) => {
    return Promise.resolve().then(() => {
      const wrongAnsweredQuestion = WrongAnsweredQuestion(wrongAnsweredQuestionEntity)

      return wrongAnsweredQuestionRepository.create(wrongAnsweredQuestion)
    })
  }

  return {
    create
  }
}
