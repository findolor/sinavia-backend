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

  const getOne = ({ userId, subjectId }) => {
    return Promise
      .resolve()
      .then(() => {
        const userGoals = userGoalRepository.findOne({
          where: {
            userId: userId,
            subjectId: subjectId
          }
        })
        return userGoals
      })
  }

  return {
    getBatch,
    getOne
  }
}
