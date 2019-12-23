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

  return {
    deleteGoal
  }
}
