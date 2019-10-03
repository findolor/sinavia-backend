const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const Leaderboard = t.struct({
  id: t.maybe(t.Number),
  examId: t.Number,
  courseId: t.maybe(t.Number),
  subjectId: t.maybe(t.Number),
  userList: t.Array,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  Leaderboard
)
