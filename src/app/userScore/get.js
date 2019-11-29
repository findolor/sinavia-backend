module.exports = ({ userScoreRepository, database, Sequelize }) => {
  const Op = Sequelize.Op

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

  const getMultipleIds = ({ idList, examId, courseId, subjectId }) => {
    return Promise
      .resolve()
      .then(() => {
        const userScore = userScoreRepository.findAll({
          where: {
            userId: idList,
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
            examId: examId,
            totalPoints: {
              [Op.ne]: 0
            }
          },
          order: [['totalPoints', 'DESC']],
          include: [database.models.users]
        }

        if (courseId) {
          if (subjectId) {
            queryOptions.where.courseId = courseId
            queryOptions.where.subjectId = subjectId
          } else queryOptions.where.courseId = courseId
        }

        return userScoreRepository.findAll(queryOptions)
      })
  }

  const getFriendScores = ({ userIdList, clientId, examId, courseId, subjectId }) => {
    return Promise
      .resolve()
      .then(() => {
        userIdList.push(clientId)

        const queryOptions = {
          where: {
            examId: examId,
            userId: userIdList
          },
          order: [['totalPoints', 'DESC']],
          include: [database.models.users]
        }

        if (courseId) {
          if (subjectId) {
            queryOptions.where.courseId = courseId
            queryOptions.where.subjectId = subjectId
          } else queryOptions.where.courseId = courseId
        }

        return userScoreRepository.findAll(queryOptions)
      })
  }

  return {
    getOne,
    getBatch,
    getFriendScores,
    getMultipleIds
  }
}
