const container = require('src/container') // we have to get the DI
const { getFriend, postFriend } = require('src/app/friendship')
const Sequelize = require('sequelize')

module.exports = () => {
  const { repository: {
    friendshipRepository
  } } = container.cradle

  const getUseCase = getFriend({ friendshipRepository, Sequelize })
  const postUseCase = postFriend({ friendshipRepository })

  return {
    getUseCase,
    postUseCase
  }
}
