const engineInterface = require('../websocket/utils/loadInterface')

exports.getOneQuestion = async (id) => {
  return engineInterface().getQuestionUseCase.getOne({ id: id })
}

exports.getMultipleQuestions = async (idList, matchInformation) => {
  return engineInterface().getQuestionUseCase.getMultiple({ idList: idList, matchInformation: matchInformation })
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
