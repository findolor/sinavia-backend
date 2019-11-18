const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const Statistic = t.struct({
  id: t.maybe(t.Number),
  examId: t.Number,
  courseId: t.Number,
  subjectId: t.Number,
  correctNumber: t.Number,
  incorrectNumber: t.Number,
  unansweredNumber: t.Number,
  earnedPoints: t.maybe(t.Number),
  gameResult: t.maybe(t.String),
  userId: t.String,
  gameModeType: t.String,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  Statistic
)
