const { User } = require('src/domain/user')
const moment = require('moment')
moment.locale('tr')

module.exports = ({ userRepository }) => {
  // code for getting all the items
  const create = ({ body }) => {
    return Promise
      .resolve()
      .then(() => {
        body.profilePicture =
            'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png'
        body.coverPicture =
            'https://assets.traveltriangle.com/blog/wp-content/uploads/2017/11/Hill-Stations-Near-Kolkata-cover1-400x267.jpg'
        body.totalPoints = 0
        body.isPremium = true
        body.premiumEndDate = moment().add(1, 'weeks').toDate()

        const entity = Object.assign({}, body)
        const user = User(entity)
        return userRepository.create(user)
      })
      .catch((error) => {
        throw error
      })
  }

  return {
    create
  }
}
