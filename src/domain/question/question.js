const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const Question = t.struct({
  id: t.maybe(t.Number),
  examName: t.String,
  courseName: t.String,
  subjectName: t.String,
  questionLink: t.String,
  correctAnswer: t.maybe(t.Number),
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  Question
)
