const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const CourseEntity = t.struct({
  id: t.maybe(t.Number),
  name: t.String,
  imageLink: t.String,
  examId: t.Number,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  CourseEntity
)
