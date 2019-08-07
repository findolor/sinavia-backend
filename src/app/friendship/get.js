module.exports = ({ friendshipRepository, Sequelize }) => {
  const Op = Sequelize.Op

  const getBatch = ({ id }) => {
    return Promise
      .resolve()
      .then(() => {
        const friendsIdList = friendshipRepository.findAll({
          where: {
            [Op.or]: [
              {
                userId: id
              },
              {
                friendId: id
              }
            ]
          }
        })
        return friendsIdList
      })
      .catch(error => {
        throw new Error(error)
      })
  }

  return {
    getBatch
  }
}
