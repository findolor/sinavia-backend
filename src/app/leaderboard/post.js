const { Leaderboard } = require('src/domain/leaderboard')

module.exports = ({ leaderboardRepository }) => {
  const create = ({ leaderboardEntity }) => {
    return Promise.resolve().then(() => {
      const leaderboard = Leaderboard(leaderboardEntity)
      const now = new Date()
      leaderboard.createdAt = now
      leaderboard.updatedAt = now

      return leaderboardRepository.create(leaderboard)
    })
  }

  return {
    create
  }
}
