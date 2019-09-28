const container = require('src/container') // we have to get the DI
const { getUserNotification, postUserNotification } = require('src/app/userNotification')

module.exports = () => {
  const {
    repository: { userNotificationRepository }
  } = container.cradle

  const getUserNotificationUseCase = getUserNotification({ userNotificationRepository })
  const postUserNotificationUseCase = postUserNotification({ userNotificationRepository })

  return {
    getUserNotificationUseCase,
    postUserNotificationUseCase
  }
}
