const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const OngoingMatch = t.struct({
  id: t.maybe(t.Number),
  userId: t.maybe(t.String),
  friendId: t.maybe(t.String),
  userResults: t.maybe(t.Number),
  friendResults: t.maybe(t.Number),
  questionList: t.maybe(t.Array),
  endDate: t.maybe(t.Date),
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  OngoingMatch
)
