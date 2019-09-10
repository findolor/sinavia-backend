const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const CourseName = t.struct({
  id: t.maybe(t.Number),
  name: t.String,
  description: t.String,
  imageLink: t.String,
  examId: t.Number,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  CourseName
)
