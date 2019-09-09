const { Friendship } = require('src/domain/friendship')

module.exports = ({ friendshipRepository }) => {
  const create = ({ body }) => {
    return Promise.resolve().then(() => {
      const entity = Object.assign({}, {
        userId: body.userId,
        friendId: body.friendId
      })
      const friendship = Friendship(entity)

      return friendshipRepository.create(friendship)
    })
  }

  return {
    create
  }
}
