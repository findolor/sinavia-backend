const container = require('src/container') // we have to get the DI
const { getQuestion } = require('src/app/question')
const { getUser } = require('src/app/user')
const { postStatistic } = require('src/app/statistic')
const { postFriendsMatch } = require('src/app/friendsMatch')
const Sequelize = require('sequelize')

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
    },
    repository: {
      friendsMatchRepository
    }
  } = container.cradle

  const getQuestionUseCase = getQuestion({ questionRepository })
  const postStatisticUseCase = postStatistic({ statisticRepository })
  const getUserUseCase = getUser({ userRepository, Sequelize })
  const postFriendsMatchUseCase = postFriendsMatch({ friendsMatchRepository })

  return {
    getQuestionUseCase,
    postStatisticUseCase,
    getUserUseCase,
    postFriendsMatchUseCase
  }
}
