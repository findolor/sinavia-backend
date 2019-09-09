module.exports = ({ friendshipRepository }) => {
  const deleteFriendship = ({ userId, friendId }) => {
    return Promise.resolve().then(() => {
      return friendshipRepository.destroy({
        where: {
          userId: userId,
          friendId: friendId
        }
      })
    })
  }

  return {
    deleteFriendship
  }
}
