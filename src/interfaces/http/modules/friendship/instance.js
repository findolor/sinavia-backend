const container = require('src/container') // we have to get the DI
const { getFriend, postFriend, putFriend, deleteFriend } = require('src/app/friendship')
const { getUser } = require('src/app/user')
const { postNotification } = require('src/app/notification')
const Sequelize = require('sequelize')

module.exports = () => {
  const {
    repository: { friendshipRepository },
    repository: { userRepository },
    repository: { notificationRepository },
    fcmService
  } = container.cradle

  const getUseCase = getFriend({ friendshipRepository, Sequelize })
  const postUseCase = postFriend({ friendshipRepository, fcmService })
  const getUserUseCase = getUser({ userRepository, Sequelize })
  const putUseCase = putFriend({ friendshipRepository, fcmService })
  const deleteUseCase = deleteFriend({ friendshipRepository, fcmService })
  const postNotificationUseCase = postNotification({ notificationRepository })

  return {
    getUseCase,
    postUseCase,
    putUseCase,
    deleteUseCase,
    getUserUseCase,
    postNotificationUseCase,
    fcmService
  }
}
