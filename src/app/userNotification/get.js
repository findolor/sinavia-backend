module.exports = ({ userNotificationRepository }) => {
  const getBatch = ({ userId }) => {
    return Promise
      .resolve()
      .then(() => {
        return userNotificationRepository.findAll({
          where: {
            userId: userId,
            read: false
          },
          limit: 10,
          order: [['id', 'ASC']]
        })
      })
  }

  return {
    getBatch
  }
}
