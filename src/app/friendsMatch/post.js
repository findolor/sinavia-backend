const { FriendsMatch } = require('src/domain/friendsMatch')

module.exports = ({ friendsMatchRepository }) => {
  const create = ({ gameInformation }) => {
    return Promise.resolve().then(() => {
      const entity = Object.assign({}, gameInformation)
      const friendsMatch = FriendsMatch(entity)

      return friendsMatchRepository.create(friendsMatch)
    })
  }

  return {
    create
  }
}
