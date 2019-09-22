module.exports = ({ userJokerRepository }) => {
  const deleteUserJoker = ({ userId, jokerId }) => {
    return Promise.resolve().then(() => {
      return userJokerRepository.destroy({
        where: {
          userId: userId,
          jokerId: jokerId
        }
      })
    })
  }

  return {
    deleteUserJoker
  }
}
