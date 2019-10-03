module.exports = ({ userScoreRepository, database }) => {
  const getOne = ({ userId, examId, courseId, subjectId }) => {
    return Promise
      .resolve()
      .then(() => {
        const userScore = userScoreRepository.findOne({
          where: {
            userId: userId,
            examId: examId,
            courseId: courseId,
            subjectId: subjectId
          }
        })
        return userScore
      })
  }

  const getBatch = ({ examId, courseId, subjectId }) => {
    return Promise
      .resolve()
      .then(() => {
        const queryOptions = {
          where: {
            examId: examId
          }
        }

        if (courseId) {
          if (subjectId) {
            queryOptions.where.courseId = courseId
            queryOptions.where.subjectId = subjectId
          } else queryOptions.where.courseId = courseId
        }

        return userScoreRepository.findAll({
          queryOptions,
          order: [['totalPoints', 'DESC']],
          include: [database.models.users]
        })
      })
  }

  const getFriendScores = ({ userIdList }) => {
    return Promise
      .resolve()
      .then(() => {
        return userScoreRepository.findAll({
          where: {
            userId: userIdList
          },
          order: [['totalPoints', 'DESC']],
          include: [database.models.users]
        })
      })
  }

  return {
    getOne,
    getBatch,
    getFriendScores
  }
}
