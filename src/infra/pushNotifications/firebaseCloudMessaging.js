module.exports = ({ config }) => {
  const sendDataMessage = (registrationToken, data) => {
    const message = {
      data,
      token: registrationToken
    }

    return config.fcm.firebaseAdmin.messaging().send(message)
  }

  // TODO Add the android and apns to other
  const sendNotificationDataMessage = (registrationToken, notification, data) => {
    const message = {
      notification,
      data,
      token: registrationToken,
      android: {
        notification: {
          color: '#00D9EF',
          sound: 'default'
        }
      },
      apns: {
        headers: {
          'apns-priority': '10'
        },
        payload: {
          aps: {
            sound: 'default'
          }
        }
      }
    }

    return config.fcm.firebaseAdmin.messaging().send(message)
  }

  const sendNotificationOnlyMessage = (registrationToken, notification) => {
    const payload = {
      notification,
      token: registrationToken,
      android: {
        notification: {
          color: '#00D9EF',
          sound: 'default'
        },
        apns: {
          headers: {
            'apns-priority': '10'
          },
          payload: {
            aps: {
              sound: 'default'
            }
          }
        }
      }
    }

    return config.fcm.firebaseAdmin.messaging().send(payload)
  }

  return {
    sendDataMessage,
    sendNotificationDataMessage,
    sendNotificationOnlyMessage
  }
}
