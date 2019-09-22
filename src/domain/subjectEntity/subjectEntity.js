const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('../helper')

const SubjectEntity = t.struct({
  id: t.maybe(t.Number),
  name: t.String,
  courseId: t.Number,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date)
})

module.exports = compose(
  cleanData,
  SubjectEntity
)
