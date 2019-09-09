const fcmService = require('./firebaseCloudMessaging')

module.exports = ({ config, logger }) => {
  return {
    sendDataMessage: (registrationToken, data) => {
      return fcmService({ config, logger }).sendDataMessage(registrationToken, data)
    },
    sendNotificationDataMessage: (registrationToken, notification, data) => {
      return fcmService({ config, logger }).sendNotificationDataMessage(registrationToken, notification, data)
    }
  }
}
