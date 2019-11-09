const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const OngoingMatch = t.struct({
  id: t.maybe(t.Number),
  userId: t.maybe(t.String),
  friendId: t.maybe(t.String),
  // Results are general statistics
  userResults: t.maybe(t.Number),
  friendResults: t.maybe(t.Number),
  // Answers are question answers for each question
  userAnswers: t.maybe(t.Array),
  questionList: t.maybe(t.Array),
  endDate: t.maybe(t.Date),
  examId: t.maybe(t.Number),
  courseId: t.maybe(t.Number),
  subjectId: t.maybe(t.Number),
  roomCode: t.maybe(t.String),
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  OngoingMatch
)
