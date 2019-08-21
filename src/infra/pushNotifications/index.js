const fcmService = require('./firebaseCloudMessaging')

module.exports = ({ config, logger }) => {
  return {
    sendNotification: (registrationToken, payload) => {
      return fcmService({ config, logger }).sendNotification(registrationToken, payload)
    }
  }
}
