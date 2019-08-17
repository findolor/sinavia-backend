
const container = require('src/container') // we have to get the DI
const { getUser } = require('src/app/user')
const Sequelize = require('sequelize')

module.exports = () => {
  const { repository: {
    userRepository
  } } = container.cradle

  const getUseCase = getUser({
    userRepository,
    Sequelize
  })

  return {
    getUseCase
  }
}
