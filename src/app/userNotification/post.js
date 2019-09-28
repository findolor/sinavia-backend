const { UserNotification } = require('src/domain/userNotification')

module.exports = ({ userNotificationRepository }) => {
  const create = ({ body }) => {
    return Promise.resolve().then(() => {
      const entity = Object.assign({}, {
        notificationType: body.notificationType,
        notificationData: body.notificationData,
        userId: body.userId
      })
      const userNotification = UserNotification(entity)

      return userNotificationRepository.create(userNotification)
    })
  }

  return {
    create
  }
}
