const container = require('src/container') // we have to get the DI
const { getUser, postUser, putUser, removeUser } = require('src/app/user')
const Sequelize = require('sequelize')

module.exports = () => {
  const { repository: {
    userRepository
  } } = container.cradle

  const getUseCase = getUser({ userRepository, Sequelize })
  const postUseCase = postUser({ userRepository })
  const putUseCase = putUser({ userRepository })
  const deleteUseCase = removeUser({ userRepository })

  return {
    getUseCase,
    postUseCase,
    putUseCase,
    deleteUseCase
  }
}
