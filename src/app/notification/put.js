const { Notification } = require('src/domain/notification')

module.exports = ({ notificationRepository }) => {
  const update = ({ notificationEntity }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const notification = Notification(notificationEntity)

        await notificationRepository.update(notification, {
          where: {
            id: notificationEntity.id
          }
        })

        resolve(notification)
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    update
  }
}
