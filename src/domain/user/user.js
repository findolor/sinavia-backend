const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const User = t.struct({
  id: t.maybe(t.String),
  username: t.String,
  name: t.String,
  lastname: t.String,
  email: t.String,
  city: t.maybe(t.String),
  birthDate: t.maybe(t.String),
  profilePicture: t.maybe(t.String),
  coverPicture: t.maybe(t.String),
  totalPoints: t.maybe(t.Number),
  fcmToken: t.maybe(t.String),
  deviceId: t.String,
  isPremium: t.maybe(t.Boolean),
  premiumEndDate: t.maybe(t.Date),
  password: t.maybe(t.String),
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  User
)
