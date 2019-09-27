
const container = require('src/container') // we have to get the DI
const { post } = require('src/app/token')
const { getUser } = require('src/app/user')
const Sequelize = require('sequelize')

module.exports = () => {
  const { repository: {
    userRepository
  }, jwt } = container.cradle

  const postUseCase = post({
    userRepository,
    webToken: jwt
  })
  const getUserUseCase = getUser({ userRepository, Sequelize })

  return {
    postUseCase,
    getUserUseCase
  }
}
