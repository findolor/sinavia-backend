const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const UserScore = t.struct({
  id: t.maybe(t.String),
  userId: t.String,
  examId: t.Number,
  courseId: t.Number,
  subjectId: t.Number,
  totalPoints: t.Number,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  UserScore
)