module.exports = ({ userGoalRepository }) => {
  const deleteGoal = ({ userId, subjectId }) => {
    return Promise.resolve().then(() => {
      return userGoalRepository.destroy({
        where: {
          userId: userId,
          subjectId: subjectId
        }
      })
    })
  }

  const deleteAll = () => {
    return Promise.resolve().then(() => {
      return userGoalRepository.destroy({
        where: {}
      })
    })
  }

  return {
    deleteGoal,
    deleteAll
  }
}
