const container = require('src/container') // we have to get the DI
const { get } = require('src/app/question')
const { post } = require('src/app/statistic')

module.exports = () => {
  const { repository: {
    questionRepository,
    statisticRepository
  } } = container.cradle

  const getQuestionUseCase = get({ questionRepository })
  /* const postUseCase = post({ questionRepository })
  const putUseCase = put({ questionRepository })
  const deleteUseCase = remove({ questionRepository }) */

  const postStatisticUseCase = post({ statisticRepository })

  return {
    getQuestionUseCase,
    postStatisticUseCase
  }
}
