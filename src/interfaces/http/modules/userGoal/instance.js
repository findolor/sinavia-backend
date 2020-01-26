const container = require('src/container') // we have to get the DI
const { getUserGoal, postUserGoal, deleteUserGoal } = require('src/app/userGoal')

module.exports = () => {
  const {
    repository: { userGoalRepository }
  } = container.cradle

  const getUserGoalUseCase = getUserGoal({ userGoalRepository })
  const postUserGoalUseCase = postUserGoal({ userGoalRepository })
  const deleteUserGoalUseCase = deleteUserGoal({ userGoalRepository })

  return {
    getUserGoalUseCase,
    postUserGoalUseCase,
    deleteUserGoalUseCase
  }
}
