const { Friendship } = require('src/domain/friendship')

module.exports = ({ friendshipRepository, fcmService }) => {
  const create = ({ body, requestingUserData }) => {
    return Promise.resolve().then(() => {
      const entity = Object.assign({}, body)
      const friendship = Friendship(entity)

      const returnedFriendship = friendshipRepository.create(friendship)

      fcmService.sendOneNotification(
        requestingUserData.fcmToken,
        {
          type: 'friendRequest',
          title: 'Arkadaş İsteği!',
          body: `${requestingUserData.username} seni arkadaş olarak ekledi.`,
          userId: requestingUserData.id
        }
      )

      return returnedFriendship
    })
  }

  return {
    create
  }
}
