const container = require('src/container') // we have to get the DI
const { getInviteCode } = require('src/app/inviteCode')

module.exports = () => {
  const {
    repository: { inviteCodeRepository }
  } = container.cradle

  const getInviteCodeUseCase = getInviteCode({ inviteCodeRepository })

  return {
    getInviteCodeUseCase
  }
}
