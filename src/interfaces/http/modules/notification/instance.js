const container = require('src/container') // we have to get the DI
const { getNotification, postNotification, putNotification } = require('src/app/notification')

module.exports = () => {
  const {
    repository: { notificationRepository }
  } = container.cradle

  const getNotificationUseCase = getNotification({ notificationRepository })
  const postNotificationUseCase = postNotification({ notificationRepository })
  const putNotificationUseCase = putNotification({ notificationRepository })

  return {
    getNotificationUseCase,
    postNotificationUseCase,
    putNotificationUseCase
  }
}
