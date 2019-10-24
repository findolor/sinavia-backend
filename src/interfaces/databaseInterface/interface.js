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

exports.getUserJoker = (userId) => {
  return engineInterface().getUserJokerUseCase.getJokers({ userId: userId })
}

exports.putUserJoker = (userJokerEntity) => {
  return engineInterface().putUserJokerUseCase.updateUserJoker({ userJokerEntity: userJokerEntity })
}

exports.updateUserTotalPoints = (userEntity) => {
  return engineInterface().putUserUseCase.updateUser({ id: userEntity.id, body: userEntity })
}

exports.getAllScores = (examId, courseId, subjectId) => {
  return engineInterface().getUserScoreUseCase.getBatch({ examId: examId, courseId: courseId, subjectId: subjectId })
}

exports.makeLeaderboards = (leaderboardEntity) => {
  return engineInterface().postLeaderboardUseCase.create({ leaderboardEntity: leaderboardEntity })
}

exports.checkLeaderboard = (examId, courseId, subjectId) => {
  return engineInterface().getLeaderboardUseCase.checkOne({ examId: examId, courseId: courseId, subjectId: subjectId })
}

exports.updateLeaderboard = (leaderboardEntity) => {
  return engineInterface().putLeaderboardUseCase.update({ leaderboardEntity: leaderboardEntity })
}

exports.getOngoingMatch = (ongoingMatchId) => {
  return engineInterface().getOngoingMatchUseCase.getOne({ id: ongoingMatchId })
}

exports.createOngoingMatch = (userId, friendId, endDate, questionList, examId, courseId, subjectId) => {
  return engineInterface().postOngoingMatchUseCase.create({ userId: userId, friendId: friendId, endDate: endDate, questionList: questionList, examId: examId, courseId: courseId, subjectId: subjectId })
}

exports.deleteOngoingMatch = (ongoingMatchId) => {
  return engineInterface().deleteOngoingMatchUseCase.remove({ id: ongoingMatchId })
}

exports.updateOngoingMatch = (ongoingMatchEntity) => {
  return engineInterface().putOngoingMatchUseCase.update({ ongoingMatchEntity: ongoingMatchEntity })
}

exports.getAllOngoingMatches = () => {
  return engineInterface().getOngoingMatchUseCase.getAll()
}

exports.updateStatistic = (statisticEntity) => {
  return engineInterface().putStatisticUseCase.update({ statisticEntity: statisticEntity })
}

exports.getGameContent = () => {
  return engineInterface().getExamEntityUseCase.getAll()
}

exports.createNotification = (notificationEntity) => {
  return engineInterface().postNotificationUseCase.create({ body: notificationEntity })
}

exports.updateNotification = (notificationEntity) => {
  return engineInterface().putNotificationUseCase.update({ notificationEntity: notificationEntity })
}

exports.getFriendMatches = (userId, friendId) => {
  return engineInterface().getFriendsMatchUseCase.getMatches({ userId: userId, friendId: friendId })
}
