const container = require('src/container') // we have to get the DI
const { getQuestion } = require('src/app/question')
const { getUser, putUser } = require('src/app/user')
const { postStatistic, putStatistic } = require('src/app/statistic')
const { postFriendsMatch } = require('src/app/friendsMatch')
const { getUserScore, postUserScore, putUserScore } = require('src/app/userScore')
const { getUserJoker, putUserJoker, deleteUserJoker } = require('src/app/userJoker')
const { postLeaderboard, getLeaderboard, putLeaderboard } = require('src/app/leaderboard')
const { getOngoingMatch, postOngoingMatch, deleteOngoingMatch, putOngoingMatch } = require('src/app/ongoingMatch')
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
    }
  } = container.cradle

  const getQuestionUseCase = getQuestion({ questionRepository, database })
  const postStatisticUseCase = postStatistic({ statisticRepository })
  const getUserUseCase = getUser({ userRepository, Sequelize })
  const postFriendsMatchUseCase = postFriendsMatch({ friendsMatchRepository })
  const getUserScoreUseCase = getUserScore({ userScoreRepository, database })
  const postUserScoreUseCase = postUserScore({ userScoreRepository })
  const putUserScoreUseCase = putUserScore({ userScoreRepository })
  const getUserJokerUseCase = getUserJoker({ userJokerRepository, database })
  const putUserJokerUseCase = putUserJoker({ userJokerRepository })
  const deleteUserJokerUseCase = deleteUserJoker({ userJokerRepository })
  const putUserUseCase = putUser({ userRepository })
  const postLeaderboardUseCase = postLeaderboard({ leaderboardRepository })
  const getLeaderboardUseCase = getLeaderboard({ leaderboardRepository })
  const putLeaderboardUseCase = putLeaderboard({ leaderboardRepository })
  const getOngoingMatchUseCase = getOngoingMatch({ ongoingMatchRepository, database })
  const postOngoingMatchUseCase = postOngoingMatch({ ongoingMatchRepository })
  const deleteOngoingMatchUseCase = deleteOngoingMatch({ ongoingMatchRepository })
  const putOngoingMatchUseCase = putOngoingMatch({ ongoingMatchRepository })
  const putStatisticUseCase = putStatistic({ statisticRepository })

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
    deleteUserJokerUseCase,
    putUserUseCase,
    postLeaderboardUseCase,
    getLeaderboardUseCase,
    putLeaderboardUseCase,
    getOngoingMatchUseCase,
    postOngoingMatchUseCase,
    deleteOngoingMatchUseCase,
    putOngoingMatchUseCase,
    putStatisticUseCase
  }
}
