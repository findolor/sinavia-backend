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
            'https://firebasestorage.googleapis.com/v0/b/sinavia-deploy-test-258708.appspot.com/o/profilePictures%2FdefaultProfilePicture.png?alt=media&token=35aba6a0-0b4e-4721-a5f3-25468c89e9e7'
        body.coverPicture =
            'https://firebasestorage.googleapis.com/v0/b/sinavia-deploy-test-258708.appspot.com/o/coverPictures%2FdefaultCoverPicture.png?alt=media&token=0377e5ce-ed5a-45d4-b8a9-661961729d92'
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
