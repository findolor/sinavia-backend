const { ReportedUser } = require('src/domain/reportedUser')

module.exports = ({ reportedUserRepository }) => {
  const create = ({ body }) => {
    return Promise.resolve().then(() => {
      const reportedUser = ReportedUser(body)

      return reportedUserRepository.create(reportedUser)
    })
  }

  return {
    create
  }
}
