const t = require('tcomb')

const UserStatistic = t.struct({
  userId: t.String,
  statisticId: t.String
})

module.exports = UserStatistic
