const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const WrongAnsweredQuestion = t.struct({
  id: t.maybe(t.Number),
  userId: t.String,
  questionId: t.Number,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  WrongAnsweredQuestion
)
