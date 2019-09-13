const container = require('src/container') // we have to get the DI
const { getQPicURL, getQuestion } = require('src/app/question')

module.exports = () => {
  const {
    repository: { questionRepository },
    config,
    s3service,
    database
  } = container.cradle

  const getQPicURLUseCase = getQPicURL({
    config,
    s3service
  })
  const getQuestionUseCase = getQuestion({ questionRepository, database })

  return {
    getQPicURLUseCase,
    getQuestionUseCase
  }
}
