const container = require('src/container') // we have to get the DI
const { postBadge } = require('src/app/badge')

module.exports = () => {
  const {
    repository: { badgeRepository }
  } = container.cradle

  const postBadgeUseCase = postBadge({ badgeRepository })

  return {
    postBadgeUseCase
  }
}
