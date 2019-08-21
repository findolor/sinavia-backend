const fcmService = require('./firebaseCloudMessaging')

module.exports = ({ config, logger }) => {
  return {
    sendOneNotification: (registrationToken, payload) => {
      return fcmService({ config, logger }).sendOneNotification(registrationToken, payload)
    }
  }
}
