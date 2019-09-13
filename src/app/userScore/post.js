const { UserScore } = require('src/domain/userScore')

module.exports = ({ userScoreRepository }) => {
  const createUserScore = ({ userScoreEntity }) => {
    return Promise.resolve().then(() => {
      const userScore = UserScore(userScoreEntity)

      return userScoreRepository.create(userScore)
    })
  }

  return {
    createUserScore
  }
}
