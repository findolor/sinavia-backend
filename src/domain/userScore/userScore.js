const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const UserScore = t.struct({
  id: t.maybe(t.Number),
  userId: t.String,
  examId: t.Number,
  courseId: t.Number,
  subjectId: t.Number,
  totalPoints: t.Number,
  totalWin: t.Number,
  totalLose: t.Number,
  totalDraw: t.Number,
  totalGames: t.Number,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  UserScore
)
