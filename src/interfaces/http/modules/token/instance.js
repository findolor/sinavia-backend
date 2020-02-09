
const container = require('src/container') // we have to get the DI
const { post } = require('src/app/token')
const { getUser } = require('src/app/user')
const { getAppleIdentityToken } = require('src/app/appleIdentityToken')
const Sequelize = require('sequelize')

module.exports = () => {
  const {
    repository: { userRepository },
    repository: { appleIdentityTokenRepository },
    jwt,
    database
  } = container.cradle

  const postUseCase = post({
    userRepository,
    webToken: jwt
  })
  const getUserUseCase = getUser({ userRepository, Sequelize })
  const getAppleIdentityTokenUseCase = getAppleIdentityToken({ appleIdentityTokenRepository, database })

  return {
    postUseCase,
    getUserUseCase,
    getAppleIdentityTokenUseCase
  }
}
