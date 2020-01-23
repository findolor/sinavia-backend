module.exports = ({ inviteCodeRepository }) => {
  const deleteInviteCode = ({ inviteCodeId }) => {
    return Promise.resolve().then(() => {
      return inviteCodeRepository.destroy({
        where: {
          id: inviteCodeId
        }
      })
    })
  }

  return {
    deleteInviteCode
  }
}
