module.exports = ({ inviteCodeRepository }) => {
  const getBatch = ({ userId }) => {
    return Promise
      .resolve()
      .then(() => {
        const inviteCodeEntity = inviteCodeRepository.findAll({
          where: {
            userId: userId
          }
        })
        return inviteCodeEntity
      })
  }

  return {
    getBatch
  }
}
