const container = require('src/container') // we have to get the DI
const { getUser, postUser, putUser, removeUser } = require('src/app/user')
const { getFriendsMatch } = require('src/app/friendsMatch')
const Sequelize = require('sequelize')

module.exports = () => {
  const {
    repository: { userRepository },
    repository: { friendsMatchRepository },
    database
  } = container.cradle

  const getUseCase = getUser({ userRepository, Sequelize, database })
  const postUseCase = postUser({ userRepository })
  const putUseCase = putUser({ userRepository })
  const deleteUseCase = removeUser({ userRepository })
  const getFriendsMatchUseCase = getFriendsMatch({ friendsMatchRepository, Sequelize })

  return {
    getUseCase,
    postUseCase,
    putUseCase,
    deleteUseCase,
    getFriendsMatchUseCase
  }
}
