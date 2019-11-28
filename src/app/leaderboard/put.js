const { Leaderboard } = require('src/domain/leaderboard')

module.exports = ({ leaderboardRepository }) => {
  const update = ({ leaderboardEntity }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const leaderboard = Leaderboard(leaderboardEntity)
        leaderboard.updatedAt = new Date()

        await leaderboardRepository.update(leaderboard, {
          where: {
            id: leaderboardEntity.id
          }
        })

        resolve(leaderboard)
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    update
  }
}
