const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const Statistic = t.struct({
  id: t.maybe(t.Number),
  examName: t.String,
  courseName: t.String,
  subjectName: t.String,
  correctNumber: t.Number,
  incorrectNumber: t.Number,
  unansweredNumber: t.Number,
  earnedPoints: t.maybe(t.Number),
  gameResult: t.maybe(t.String),
  userId: t.String,
  createdAt: t.maybe(t.String),
  updatedAt: t.maybe(t.String)
})

module.exports = compose(
  cleanData,
  Statistic
)
