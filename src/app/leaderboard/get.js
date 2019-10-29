module.exports = ({ leaderboardRepository }) => {
  const getOne = ({ examId, courseId, subjectId }) => {
    return Promise
      .resolve()
      .then(() => {
        // We parse the variables because they arrive as strings
        const queryOptions = {
          where: {
            examId: parseInt(examId, 10),
            courseId: null,
            subjectId: null
          }
        }

        if (courseId) {
          if (subjectId) {
            queryOptions.where.courseId = parseInt(courseId, 10)
            queryOptions.where.subjectId = parseInt(subjectId, 10)
          } else queryOptions.where.courseId = parseInt(courseId, 10)
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
