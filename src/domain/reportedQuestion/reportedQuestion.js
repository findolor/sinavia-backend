const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const ReportedQuestion = t.struct({
  id: t.maybe(t.Number),
  reportingUserId: t.String,
  reportedQuestionId: t.Integer,
  question: t.maybe(t.Boolean),
  solution: t.maybe(t.Boolean),
  answer: t.maybe(t.Boolean),
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  ReportedQuestion
)
