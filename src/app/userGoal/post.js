const { UserGoal } = require('src/domain/userGoal')

module.exports = ({ userGoalRepository }) => {
  const create = ({ body }) => {
    return Promise.resolve().then(() => {
      const entity = Object.assign({}, {
        userId: body.userId,
        courseId: body.courseId,
        subjectId: body.subjectId,
        goalAmount: body.goalAmount
      })
      const userGoal = UserGoal(entity)

      return userGoalRepository.create(userGoal)
    })
  }

  return {
    create
  }
}
