module.exports = ({ userBadgeRepository, database }) => {
  const getBatch = ({ userId }) => {
    return Promise
      .resolve()
      .then(() => {
        const userBadges = userBadgeRepository.findAll({
          where: {
            userId: userId
          },
          include: [database.models.badges]
        })
        return userBadges
      })
  }

  return {
    getBatch
  }
}
