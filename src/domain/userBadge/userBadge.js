const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const UserBadge = t.struct({
  id: t.maybe(t.Number),
  userId: t.String,
  badgeId: t.Number,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  UserBadge
)
