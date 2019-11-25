const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const UserScore = t.struct({
  id: t.maybe(t.Number),
  userId: t.String,
  examId: t.Number,
  courseId: t.Number,
  subjectId: t.Number,
  totalPoints: t.maybe(t.Number),
  totalRankedWin: t.maybe(t.Number),
  totalFriendWin: t.maybe(t.Number),
  totalRankedLose: t.maybe(t.Number),
  totalFriendLose: t.maybe(t.Number),
  totalRankedDraw: t.maybe(t.Number),
  totalFriendDraw: t.maybe(t.Number),
  totalGroupGames: t.maybe(t.Number),
  totalSoloGames: t.maybe(t.Number),
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  UserScore
)
