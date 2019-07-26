const User = require('./user')
const Question = require('./question')
const Statistic = require('./statistic')

module.exports = ({ database }) => {
  const userModel = database.models.users
  const questionModel = database.models.questions
  const statisticModel = database.models.statistic

  return {
    userRepository: User({ model: userModel }),
    questionRepository: Question({ model: questionModel })
  }
}
