const container = require('src/container') // we have to get the DI
const { getQuestion } = require('src/app/question')
const { getUser } = require('src/app/user')
const { postStatistic } = require('src/app/statistic')

module.exports = () => {
  const { 
    repository: {
      questionRepository
    },
    repository: {
      statisticRepository
    },
    repository: {
      userRepository
    }
  } = container.cradle

  const getQuestionUseCase = getQuestion({ questionRepository })
  /* const postUseCase = post({ questionRepository })
  const putUseCase = put({ questionRepository })
  const deleteUseCase = remove({ questionRepository }) */
  
  const postStatisticUseCase = postStatistic({ statisticRepository })

  const getUserUseCase = getUser({ userRepository })

  return {
    getQuestionUseCase,
    postStatisticUseCase,
    getUserUseCase
  }
}
