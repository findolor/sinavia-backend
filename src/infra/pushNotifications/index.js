const fcmService = require('./firebaseCloudMessaging')

module.exports = ({ config }) => {
  return {
    sendDataMessage: (registrationToken, data) => {
      return fcmService({ config }).sendDataMessage(registrationToken, data)
    },
    sendNotificationDataMessage: (registrationToken, notification, data) => {
      return fcmService({ config }).sendNotificationDataMessage(registrationToken, notification, data)
    },
    sendNotificationOnlyMessage: (registrationToken, notification) => {
      return fcmService({ config }).sendNotificationOnlyMessage(registrationToken, notification)
    }
  }
}
