module.exports = ({ config }) => {
  const sendDataMessage = (registrationToken, data) => {
    const message = {
      data,
      token: registrationToken
    }

    return config.fcm.firebaseAdmin.messaging().send(message)
  }

  const sendNotificationDataMessage = (registrationToken, notification, data) => {
    const message = {
      notification,
      data,
      token: registrationToken
    }

    return config.fcm.firebaseAdmin.messaging().send(message)
  }

  return {
    sendDataMessage,
    sendNotificationDataMessage
  }
}
