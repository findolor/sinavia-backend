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

exports.postStatistic = async (gameResults) => {
  return engineInterface().postStatisticUseCase.createStat({ gameResults: gameResults })
}

exports.getMultipleUsers = async (idList) => {
  return engineInterface().getUserUseCase.getMultiple({ idList: idList })
}

exports.getOneUser = async (id) => {
  return engineInterface().getUserUseCase.getOne({ id: id })
}

exports.postFriendGameMatchResult = async (gameInformation) => {
  return engineInterface().postFriendsMatchUseCase.create({ gameInformation: gameInformation })
}

exports.getMatchInformation = async (examId) => {
  return engineInterface().getExamEntityUseCase.getFullExamInformation({ examId: examId })
}
