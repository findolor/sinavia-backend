const { Leaderboard } = require('src/domain/leaderboard')

module.exports = ({ leaderboardRepository }) => {
  const create = ({ leaderboardEntity }) => {
    return Promise.resolve().then(() => {
      const leaderboard = Leaderboard(leaderboardEntity)

      return leaderboardRepository.create(leaderboard)
    })
  }

  return {
    create
  }
}
