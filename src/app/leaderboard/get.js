module.exports = ({ leaderboardRepository }) => {
  const getOne = ({ examId, courseId, subjectId }) => {
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

        return leaderboardRepository.findOne(queryOptions)
      })
  }

  const checkOne = ({ examId, courseId, subjectId }) => {
    return Promise
      .resolve()
      .then(() => {
        return leaderboardRepository.findOne({
          where: {
            examId: examId,
            courseId: courseId,
            subjectId: subjectId
          }
        })
      })
  }

  return {
    getOne,
    checkOne
  }
}
