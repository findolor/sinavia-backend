const container = require('src/container') // we have to get the DI
const { getQuestion } = require('src/app/question')
const { getUser, putUser } = require('src/app/user')
const { postStatistic, putStatistic } = require('src/app/statistic')
const { postFriendsMatch, getFriendsMatch } = require('src/app/friendsMatch')
const { getUserScore, postUserScore, putUserScore } = require('src/app/userScore')
const { getUserJoker, putUserJoker } = require('src/app/userJoker')
const { postLeaderboard, getLeaderboard, putLeaderboard } = require('src/app/leaderboard')
const { getOngoingMatch, postOngoingMatch, deleteOngoingMatch, putOngoingMatch } = require('src/app/ongoingMatch')
const { getExamEntity } = require('src/app/examEntity')
const { postNotification, putNotification } = require('src/app/notification')
const { getUnsolvedQuestion, postUnsolvedQuestion, deleteUnsolvedQuestion } = require('src/app/unsolvedQuestion')
const { deleteUserGoal, putUserGoal } = require('src/app/userGoal')
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
    },
    repository: {
      userJokerRepository
    },
    repository: {
      leaderboardRepository
    },
    repository: {
      ongoingMatchRepository
    },
    repository: {
      examEntityRepository
    },
    repository: {
      notificationRepository
    },
    repository: {
      unsolvedQuestionRepository
    },
    repository: {
      userGoalRepository
    }
  } = container.cradle

  const getQuestionUseCase = getQuestion({ questionRepository, database })
  const postStatisticUseCase = postStatistic({ statisticRepository })
  const getUserUseCase = getUser({ userRepository, Sequelize })
  const postFriendsMatchUseCase = postFriendsMatch({ friendsMatchRepository })
  const getUserScoreUseCase = getUserScore({ userScoreRepository, database, Sequelize })
  const postUserScoreUseCase = postUserScore({ userScoreRepository })
  const putUserScoreUseCase = putUserScore({ userScoreRepository })
  const getUserJokerUseCase = getUserJoker({ userJokerRepository, database })
  const putUserJokerUseCase = putUserJoker({ userJokerRepository })
  const putUserUseCase = putUser({ userRepository })
  const postLeaderboardUseCase = postLeaderboard({ leaderboardRepository })
  const getLeaderboardUseCase = getLeaderboard({ leaderboardRepository })
  const putLeaderboardUseCase = putLeaderboard({ leaderboardRepository })
  const getOngoingMatchUseCase = getOngoingMatch({ ongoingMatchRepository, database })
  const postOngoingMatchUseCase = postOngoingMatch({ ongoingMatchRepository })
  const deleteOngoingMatchUseCase = deleteOngoingMatch({ ongoingMatchRepository })
  const putOngoingMatchUseCase = putOngoingMatch({ ongoingMatchRepository })
  const putStatisticUseCase = putStatistic({ statisticRepository })
  const getExamEntityUseCase = getExamEntity({ examEntityRepository, database })
  const postNotificationUseCase = postNotification({ notificationRepository })
  const putNotificationUseCase = putNotification({ notificationRepository })
  const getFriendsMatchUseCase = getFriendsMatch({ friendsMatchRepository, Sequelize })
  const getUnsolvedQuestionUseCase = getUnsolvedQuestion({ unsolvedQuestionRepository, database })
  const postUnsolvedQuestionUseCase = postUnsolvedQuestion({ unsolvedQuestionRepository })
  const deleteUnsolvedQuestionUseCase = deleteUnsolvedQuestion({ unsolvedQuestionRepository })
  const putUserGoalUseCase = putUserGoal({ userGoalRepository })
  const deleteUserGoalUseCase = deleteUserGoal({ userGoalRepository })

  return {
    getQuestionUseCase,
    postStatisticUseCase,
    getUserUseCase,
    postFriendsMatchUseCase,
    getUserScoreUseCase,
    postUserScoreUseCase,
    putUserScoreUseCase,
    getUserJokerUseCase,
    putUserJokerUseCase,
    putUserUseCase,
    postLeaderboardUseCase,
    getLeaderboardUseCase,
    putLeaderboardUseCase,
    getOngoingMatchUseCase,
    postOngoingMatchUseCase,
    deleteOngoingMatchUseCase,
    putOngoingMatchUseCase,
    putStatisticUseCase,
    getExamEntityUseCase,
    postNotificationUseCase,
    putNotificationUseCase,
    getFriendsMatchUseCase,
    getUnsolvedQuestionUseCase,
    postUnsolvedQuestionUseCase,
    deleteUnsolvedQuestionUseCase,
    putUserGoalUseCase,
    deleteUserGoalUseCase
  }
}
