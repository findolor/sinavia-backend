const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const Friendship = t.struct({
  id: t.maybe(t.Number),
  userId: t.String,
  friendId: t.String,
  friendshipStatus: t.maybe(t.String),
  createdAt: t.maybe(t.String),
  updatedAt: t.maybe(t.String)
})

module.exports = compose(
  cleanData,
  Friendship
)
