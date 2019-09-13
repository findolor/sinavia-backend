const container = require('src/container') // we have to get the DI
const { getQuestion } = require('src/app/question')
const { getUser } = require('src/app/user')
const { postStatistic } = require('src/app/statistic')
const { postFriendsMatch } = require('src/app/friendsMatch')
const { getExamEntity } = require('src/app/examEntity')
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
      examEntityRepository
    }
  } = container.cradle

  const getQuestionUseCase = getQuestion({ questionRepository, database })
  const postStatisticUseCase = postStatistic({ statisticRepository })
  const getUserUseCase = getUser({ userRepository, Sequelize })
  const postFriendsMatchUseCase = postFriendsMatch({ friendsMatchRepository })
  const getExamEntityUseCase = getExamEntity({ examEntityRepository, database })

  return {
    getQuestionUseCase,
    postStatisticUseCase,
    getUserUseCase,
    postFriendsMatchUseCase,
    getExamEntityUseCase
  }
}
