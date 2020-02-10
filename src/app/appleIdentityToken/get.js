module.exports = ({ appleIdentityTokenRepository, database }) => {
  const getOne = ({ identityToken }) => {
    return Promise
      .resolve()
      .then(() => {
        return appleIdentityTokenRepository.findOne({
          where: {
            identityToken: identityToken
          },
          include: [database.models.users]
        })
      })
  }

  return {
    getOne
  }
}
