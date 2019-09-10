const container = require('src/container') // we have to get the DI
const { getUserBadge, postUserBadge } = require('src/app/userBadge')

module.exports = () => {
  const {
    repository: { userBadgeRepository },
    database
  } = container.cradle

  const getUserBadgeUseCase = getUserBadge({ userBadgeRepository, database })
  const postUserBadgeUseCase = postUserBadge({ userBadgeRepository })

  return {
    getUserBadgeUseCase,
    postUserBadgeUseCase
  }
}
