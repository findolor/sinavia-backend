const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const AppleIdentityToken = t.struct({
  id: t.maybe(t.Number),
  userId: t.String,
  identityToken: t.String,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  AppleIdentityToken
)
