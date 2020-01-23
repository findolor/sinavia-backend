const { InviteCode } = require('src/domain/inviteCode')

module.exports = ({ inviteCodeRepository }) => {
  const create = ({ body }) => {
    return Promise.resolve().then(() => {
      const inviteCode = InviteCode(body)

      return inviteCodeRepository.create(inviteCode)
    })
  }

  return {
    create
  }
}
