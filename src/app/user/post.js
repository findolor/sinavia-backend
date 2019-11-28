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
            'https://firebasestorage.googleapis.com/v0/b/sinavia-deploy-test-258708.appspot.com/o/profilePictures%2FdefaultProfilePicture.png?alt=media&token=48e536e2-a937-4734-871f-d7d982c663cf'
        body.coverPicture =
            'https://firebasestorage.googleapis.com/v0/b/sinavia-deploy-test-258708.appspot.com/o/coverPictures%2FdefaultCoverPicture.jpg?alt=media&token=146b2665-502d-4d0e-b83f-94557731da56'
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
