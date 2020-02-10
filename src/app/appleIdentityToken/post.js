const { AppleIdentityToken } = require('src/domain/appleIdentityToken')

module.exports = ({ appleIdentityTokenRepository }) => {
  const create = ({ body }) => {
    return Promise.resolve().then(() => {
      const entity = Object.assign({}, {
        userId: body.userId,
        identityToken: body.identityToken
      })
      const appleIdentityToken = AppleIdentityToken(entity)

      return appleIdentityTokenRepository.create(appleIdentityToken)
    })
  }

  return {
    create
  }
}
