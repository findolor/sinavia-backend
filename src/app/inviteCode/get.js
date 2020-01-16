module.exports = ({ inviteCodeRepository, database }) => {
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

  const getUserFromCode = ({ inviteCode }) => {
    return Promise
      .resolve()
      .then(() => {
        const inviteCodeEntity = inviteCodeRepository.findOne({
          where: {
            code: inviteCode
          },
          include: [{ model: database.models.users }]
        })
        return inviteCodeEntity
      })
  }

  return {
    getBatch,
    getUserFromCode
  }
}
