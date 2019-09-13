const container = require('src/container') // we have to get the DI
const { getQuestion } = require('src/app/question')
const { getUser } = require('src/app/user')
const { postStatistic } = require('src/app/statistic')
const { postFriendsMatch } = require('src/app/friendsMatch')
const { getUserScore, postUserScore, putUserScore } = require('src/app/userScore')
const Sequelize = require('sequelize')

module.exports = () => {
  const {
    database,
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
    },
    repository: {
      userScoreRepository
    }
  } = container.cradle

  const getQuestionUseCase = getQuestion({ questionRepository, database })
  const postStatisticUseCase = postStatistic({ statisticRepository })
  const getUserUseCase = getUser({ userRepository, Sequelize })
  const postFriendsMatchUseCase = postFriendsMatch({ friendsMatchRepository })
  const getUserScoreUseCase = getUserScore({ userScoreRepository })
  const postUserScoreUseCase = postUserScore({ userScoreRepository })
  const putUserScoreUseCase = putUserScore({ userScoreRepository })

  return {
    getQuestionUseCase,
    postStatisticUseCase,
    getUserUseCase,
    postFriendsMatchUseCase,
    getUserScoreUseCase,
    postUserScoreUseCase,
    putUserScoreUseCase
  }
}
