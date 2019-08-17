const container = require('src/container') // we have to get the DI
const { getFriend, postFriend, putFriend, deleteFriend } = require('src/app/friendship')
const Sequelize = require('sequelize')

module.exports = () => {
  const { repository: {
    friendshipRepository
  } } = container.cradle

  const getUseCase = getFriend({ friendshipRepository, Sequelize })
  const postUseCase = postFriend({ friendshipRepository })
  const putUseCase = putFriend({ friendshipRepository })
  const deleteUseCase = deleteFriend({ friendshipRepository })

  return {
    getUseCase,
    postUseCase,
    putUseCase,
    deleteUseCase
  }
}
