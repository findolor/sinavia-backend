const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const GameEnergy = t.struct({
  id: t.maybe(t.Number),
  userId: t.String,
  energyAmount: t.Number,
  energyUsed: t.Number,
  shouldRenew: t.Boolean,
  dateRenewed: t.String,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  GameEnergy
)
