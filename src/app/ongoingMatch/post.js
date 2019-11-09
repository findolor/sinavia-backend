const { OngoingMatch } = require('src/domain/ongoingMatch')

module.exports = ({ ongoingMatchRepository }) => {
  const create = ({ userId, friendId, endDate, questionList, examId, courseId, subjectId, roomCode }) => {
    return Promise
      .resolve()
      .then(() => {
        const entity = Object.assign({}, {
          userId: userId,
          friendId: friendId,
          endDate: endDate,
          questionList: questionList,
          examId: examId,
          courseId: courseId,
          subjectId: subjectId,
          roomCode: roomCode
        })
        const ongoingMatch = OngoingMatch(entity)

        return ongoingMatchRepository.create(ongoingMatch)
      })
  }

  return {
    create
  }
}
