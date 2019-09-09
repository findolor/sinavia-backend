const { Friendship } = require('src/domain/friendship')

module.exports = ({ friendshipRepository }) => {
  const updateFriendship = ({ body }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const entity = Object.assign({}, {
          userId: body.userId,
          friendId: body.friendId,
          friendshipStatus: body.friendshipStatus
        })
        const friendship = Friendship(entity)

        await friendshipRepository.update(friendship, {
          where: {
            userId: body.userId,
            friendId: body.friendId
          }
        })

        resolve(friendship)
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    updateFriendship
  }
}
