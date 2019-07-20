const User = require('./user')
const Question = require('./question')

module.exports = ({ database }) => {
  const userModel = database.models.users
  const questionModel = database.models.questions

  return {
    userRepository: User({ model: userModel }),
    questionRepository: Question({ model: questionModel })
  }
}
