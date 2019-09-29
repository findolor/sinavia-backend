const moment = require('moment')
moment.locale('tr')

module.exports = ({ statisticRepository, Sequelize }) => {
  const Op = Sequelize.Op

  const attributes = [
    'examId',
    'subjectId',
    'courseId',
    'userId',
    'correctNumber',
    'incorrectNumber',
    'unansweredNumber',
    'createdAt',
    'gameResult'
  ]

  const getBatch = ({ userId }) => {
    return Promise
      .resolve()
      .then(() => {
        const statistics = statisticRepository.findAll({
          where: {
            userId: userId
          }
        })
        return statistics
      })
  }

  const getWeeklyBatch = ({ userId, examId, courseId, subjectId }) => {
    return Promise
      .resolve()
      .then(() => {
        const startOfWeek = moment().startOf('week').toDate()
        const endOfWeek = moment().endOf('week').toDate()

        const queryOptions = {
          where: {
            userId: userId,
            examId: examId,
            createdAt: {
              [Op.lte]: endOfWeek,
              [Op.gte]: startOfWeek
            }
          },
          attributes: attributes
        }

        if (courseId) {
          if (subjectId) {
            queryOptions.where.courseId = courseId
            queryOptions.where.subjectId = subjectId
          } else queryOptions.where.courseId = courseId
        }

        return statisticRepository.findAll(queryOptions)
      })
  }

  const getMonthlyBatch = ({ userId, examId, courseId, subjectId }) => {
    return Promise
      .resolve()
      .then(() => {
        const startOfMonth = moment().startOf('month').toDate()
        const endOfMonth = moment().endOf('month').toDate()

        const queryOptions = {
          where: {
            userId: userId,
            examId: examId,
            createdAt: {
              [Op.lte]: endOfMonth,
              [Op.gte]: startOfMonth
            }
          },
          attributes: attributes
        }

        if (courseId) {
          if (subjectId) {
            queryOptions.where.courseId = courseId
            queryOptions.where.subjectId = subjectId
          } else queryOptions.where.courseId = courseId
        }

        return statisticRepository.findAll(queryOptions)
      })
  }

  const getLastSixMonthsBatch = ({ userId, examId, courseId, subjectId }) => {
    return Promise
      .resolve()
      .then(() => {
        const startOfSixMonthAgo = moment().subtract(6, 'months').startOf('month').toDate()
        const endOfMonth = moment().endOf('month').toDate()

        const queryOptions = {
          where: {
            userId: userId,
            examId: examId,
            createdAt: {
              [Op.lte]: endOfMonth,
              [Op.gte]: startOfSixMonthAgo
            }
          },
          attributes: attributes
        }

        if (courseId) {
          if (subjectId) {
            queryOptions.where.courseId = courseId
            queryOptions.where.subjectId = subjectId
          } else queryOptions.where.courseId = courseId
        }

        return statisticRepository.findAll(queryOptions)
      })
  }

  return {
    getBatch,
    getWeeklyBatch,
    getMonthlyBatch,
    getLastSixMonthsBatch
  }
}
