const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const UserNotification = t.struct({
  id: t.maybe(t.Number),
  userId: t.String,
  notificationType: t.String,
  notificationData: t.Object,
  read: t.maybe(t.Boolean),
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  UserNotification
)
