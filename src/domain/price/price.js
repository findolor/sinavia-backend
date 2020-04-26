const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const Price = t.struct({
  id: t.maybe(t.Number),
  name: t.String,
  discountPrice: t.Number,
  price: t.Number,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  Price
)
