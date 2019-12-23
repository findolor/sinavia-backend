const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const UserGoal = t.struct({
  id: t.maybe(t.Number),
  userId: t.String,
  subjectId: t.Number,
  questionSolved: t.Number,
  goalAmount: t.Number,
  startDate: t.Date,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  UserGoal
)
