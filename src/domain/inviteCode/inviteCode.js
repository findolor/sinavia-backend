const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const InviteCode = t.struct({
  id: t.maybe(t.Number),
  userId: t.String,
  code: t.String,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  InviteCode
)
