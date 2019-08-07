const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const Friendship = t.struct({
  id: t.maybe(t.Number),
  userId: t.String,
  friendId: t.String,
  friendshipStatus: t.maybe(t.String),
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date),
  deletedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  Friendship
)
