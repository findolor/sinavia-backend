module.exports = {
  test: {
    databaseURL: process.env.FCM_DATABASE_URL,
    serviceAccount: require('./fcmCredentials.test.json')
  },
  local: {
    databaseURL: process.env.FCM_DATABASE_URL,
    serviceAccount: require('./fcmCredentials.local.json')
  }
}
