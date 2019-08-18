module.exports = ({ friendshipRepository }) => {
  const deleteFriendship = ({ userId }) => {
    return Promise.resolve().then(() => {
      return friendshipRepository.destroy({
        where: {
          userId: userId
        }
      })
    })
  }

  return {
    deleteFriendship
  }
}
