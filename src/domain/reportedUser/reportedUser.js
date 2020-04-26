const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const ReportedUser = t.struct({
  id: t.maybe(t.Number),
  reportingUserId: t.String,
  reportedUserId: t.String,
  name: t.maybe(t.Boolean),
  username: t.maybe(t.Boolean),
  pictures: t.maybe(t.Boolean),
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  ReportedUser
)
