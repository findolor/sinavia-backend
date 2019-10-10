const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const Notification = t.struct({
  id: t.maybe(t.Number),
  userId: t.String,
  notificationType: t.String,
  notificationData: t.String,
  read: t.maybe(t.Boolean),
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  Notification
)
