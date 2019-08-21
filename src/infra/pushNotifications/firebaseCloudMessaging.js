module.exports = ({ config, logger }) => {
  const sendNotification = (registrationToken, data) => {
    const message = {
      data,
      token: registrationToken
    }

    return config.fcm.firebaseAdmin.messaging().send(message).then(response => {
      return response
    })
  }

  return {
    sendNotification
  }
}
