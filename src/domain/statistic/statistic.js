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
  timestamp: t.String,
  userId: t.String
  // earnedPoints: t.Number
})

module.exports = compose(
  cleanData,
  Statistic
)
