module.exports = ({ notificationRepository }) => {
  const getBatch = ({ userId }) => {
    return Promise
      .resolve()
      .then(() => {
        return notificationRepository.findAll({
          where: {
            userId: userId,
            read: false
          },
          limit: 10,
          order: [['id', 'DESC']]
        })
      })
  }

  return {
    getBatch
  }
}
