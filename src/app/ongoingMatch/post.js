const { OngoingMatch } = require('src/domain/ongoingMatch')

module.exports = ({ ongoingMatchRepository }) => {
  const create = ({ userId, friendId, endDate, questionList }) => {
    return Promise
      .resolve()
      .then(() => {
        const entity = Object.assign({}, {
          userId: userId,
          friendId: friendId,
          endDate: endDate,
          questionList: questionList
        })
        const ongoingMatch = OngoingMatch(entity)

        return ongoingMatchRepository.create(ongoingMatch)
      })
  }

  return {
    create
  }
}
