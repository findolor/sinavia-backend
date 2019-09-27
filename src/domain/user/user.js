const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const User = t.struct({
  id: t.maybe(t.String),
  username: t.String,
  name: t.String,
  lastname: t.String,
  email: t.String,
  city: t.String,
  birthDate: t.String,
  // TODO MAKE PICTURES DEFAULT FOR EVERY USER
  profilePicture: t.String,
  coverPicture: t.String,
  totalPoints: t.maybe(t.Number),
  fcmToken: t.maybe(t.String),
  deviceId: t.String,
  // userLevel: t.maybe(t.Object),
  password: t.maybe(t.String),
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  User
)
