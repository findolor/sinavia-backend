const { UserGoal } = require('src/domain/userGoal')

module.exports = ({ userGoalRepository }) => {
  const updateUserGoal = ({ userGoalEntity }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const userGoal = UserGoal(userGoalEntity)

        await userGoalRepository.update(userGoal, {
          where: {
            userId: userGoalEntity.userId,
            subjectId: userGoalEntity.subjectId
          }
        })

        resolve(userGoal)
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    updateUserGoal
  }
}
