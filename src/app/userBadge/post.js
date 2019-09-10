const { UserBadge } = require('src/domain/userBadge')

module.exports = ({ userBadgeRepository }) => {
  const create = ({ body }) => {
    return Promise.resolve().then(() => {
      const entity = Object.assign({}, {
        userId: body.userId,
        badgeId: body.badgeId
      })
      const userBadge = UserBadge(entity)

      return userBadgeRepository.create(userBadge)
    })
  }

  return {
    create
  }
}
