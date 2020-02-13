const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const PurchaseReceipt = t.struct({
  id: t.maybe(t.Number),
  userId: t.String,
  receipt: t.String,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  PurchaseReceipt
)
