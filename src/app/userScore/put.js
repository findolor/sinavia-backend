const { UserScore } = require('src/domain/userScore')

module.exports = ({ userScoreRepository }) => {
  const updateUserScore = ({ userScoreEntity }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const userScore = UserScore(userScoreEntity)

        await userScoreRepository.update(userScore, {
          where: {
            userId: userScoreEntity.userId,
            examId: userScoreEntity.examId,
            courseId: userScoreEntity.courseId,
            subjectId: userScoreEntity.subjectId
          }
        })

        resolve(userScore)
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    updateUserScore
  }
}
