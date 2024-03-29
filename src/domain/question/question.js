const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const Question = t.struct({
  id: t.maybe(t.Number),
  examId: t.Number,
  courseId: t.Number,
  subjectId: t.Number,
  questionLink: t.String,
  correctAnswer: t.Number,
  solvedQuestionImage: t.maybe(t.String),
  solvedQuestionVideo: t.maybe(t.String),
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  Question
)
