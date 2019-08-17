const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const FriendsMatch = t.struct({
  id: t.maybe(t.Number),
  winnerId: t.String,
  loserId: t.String,
  isMatchDraw: t.Boolean,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  FriendsMatch
)
