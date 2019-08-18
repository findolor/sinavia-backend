const { Friendship } = require('src/domain/friendship')

module.exports = ({ friendshipRepository }) => {
  const updateFriendship = ({ body }) => {
    return Promise.resolve().then(() => {
      // TODO Change only the friendshipStatus here
      const entity = Object.assign({}, body)
      const friendship = Friendship(entity)

      return friendshipRepository.update(friendship, {
        where: {
          userId: body.userId
        }
      })
    })
  }

  return {
    updateFriendship
  }
}
