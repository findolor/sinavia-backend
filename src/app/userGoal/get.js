module.exports = ({ userGoalRepository }) => {
  const getBatch = ({ userId }) => {
    return Promise
      .resolve()
      .then(() => {
        const userGoals = userGoalRepository.findAll({
          where: {
            userId: userId
          }
        })
        return userGoals
      })
  }

  return {
    getBatch
  }
}
