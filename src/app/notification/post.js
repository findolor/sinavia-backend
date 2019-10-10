const { Notification } = require('src/domain/notification')

module.exports = ({ notificationRepository }) => {
  const create = ({ body }) => {
    return Promise.resolve().then(() => {
      const entity = Object.assign({}, {
        notificationType: body.notificationType,
        notificationData: body.notificationData,
        userId: body.userId
      })
      const notification = Notification(entity)

      return notificationRepository.create(notification)
    })
  }

  return {
    create
  }
}
