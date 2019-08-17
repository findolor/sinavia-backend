const container = require('src/container') // we have to get the DI
const { getFriendsMatch } = require('src/app/friendsMatch')
const Sequelize = require('sequelize')

module.exports = () => {
  const { repository: {
    friendsMatchRepository
  } } = container.cradle

  const getUseCase = getFriendsMatch({ friendsMatchRepository, Sequelize })

  return {
    getUseCase
  }
}
