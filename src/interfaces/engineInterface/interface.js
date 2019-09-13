const engineInterface = require('../websocket/utils/loadInterface')

exports.getOneQuestion = async (id) => {
  return engineInterface().getQuestionUseCase.getOne({ id: id })
}

exports.getMultipleQuestions = async (examId, courseId, subjectId, questionAmount) => {
  return engineInterface().getQuestionUseCase.getMultiple({
    examId: examId,
    courseId: courseId,
    subjectId: subjectId,
    questionAmount: questionAmount
  })
}

exports.postStatistic = (gameResults) => {
  return engineInterface().postStatisticUseCase.createStat({ gameResults: gameResults })
}

exports.getMultipleUsers = (idList) => {
  return engineInterface().getUserUseCase.getMultiple({ idList: idList })
}

exports.getOneUser = (id) => {
  return engineInterface().getUserUseCase.getOne({ id: id })
}

exports.postFriendGameMatchResult = (gameInformation) => {
  return engineInterface().postFriendsMatchUseCase.create({ gameInformation: gameInformation })
}

exports.getUserScore = (userId, examId, courseId, subjectId) => {
  return engineInterface().getUserScoreUseCase.getOne({
    userId: userId,
    examId: examId,
    courseId: courseId,
    subjectId: subjectId
  })
}

exports.postUserScore = (userScoreEntity) => {
  return engineInterface().postUserScoreUseCase.createUserScore({ userScoreEntity: userScoreEntity })
}

exports.putUserScore = (userScoreEntity) => {
  return engineInterface().putUserScoreUseCase.updateUserScore({ userScoreEntity: userScoreEntity })
}
