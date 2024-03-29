const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const UserJoker = t.struct({
  id: t.maybe(t.Number),
  userId: t.String,
  jokerId: t.Number,
  amount: t.Number,
  amountUsed: t.Number,
  shouldRenew: t.Boolean,
  dateRenewed: t.Date,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  UserJoker
)
