const User = require('./user')

module.exports = ({ database }) => {
  const userModel = database.models.users

  return {
    userRepository: User({ model: userModel })
  }
}
