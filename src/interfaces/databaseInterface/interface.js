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

exports.getUserScore = async (userId, examId, courseId, subjectId) => {
  return engineInterface().getUserScoreUseCase.getOne({
    userId: userId,
    examId: examId,
    courseId: courseId,
    subjectId: subjectId
  })
}

exports.postUserScore = async (userScoreEntity) => {
  return engineInterface().postUserScoreUseCase.createUserScore({ userScoreEntity: userScoreEntity })
}

exports.putUserScore = async (userScoreEntity) => {
  return engineInterface().putUserScoreUseCase.updateUserScore({ userScoreEntity: userScoreEntity })
}

exports.getUserScoreMultipleIds = async (idList, examId, courseId, subjectId) => {
  return engineInterface().getUserScoreUseCase.getMultipleIds({
    idList: idList,
    examId: examId,
    courseId: courseId,
    subjectId: subjectId
  })
}

exports.getUserJoker = async (userId) => {
  return engineInterface().getUserJokerUseCase.getJokers({ userId: userId })
}

exports.putUserJoker = async (userJokerEntity) => {
  return engineInterface().putUserJokerUseCase.updateUserJoker({ userJokerEntity: userJokerEntity })
}

exports.updateUserTotalPoints = async (userEntity) => {
  return engineInterface().putUserUseCase.updateUser({ id: userEntity.id, body: userEntity })
}

exports.getAllScores = async (examId, courseId, subjectId) => {
  return engineInterface().getUserScoreUseCase.getBatch({ examId: examId, courseId: courseId, subjectId: subjectId })
}

exports.makeLeaderboards = async (leaderboardEntity) => {
  return engineInterface().postLeaderboardUseCase.create({ leaderboardEntity: leaderboardEntity })
}

exports.checkLeaderboard = async (examId, courseId, subjectId) => {
  return engineInterface().getLeaderboardUseCase.checkOne({ examId: examId, courseId: courseId, subjectId: subjectId })
}

exports.updateLeaderboard = async (leaderboardEntity) => {
  return engineInterface().putLeaderboardUseCase.update({ leaderboardEntity: leaderboardEntity })
}

exports.getOngoingMatch = async (ongoingMatchId) => {
  return engineInterface().getOngoingMatchUseCase.getOne({ id: ongoingMatchId })
}

exports.createOngoingMatch = async (userId, friendId, endDate, questionList, examId, courseId, subjectId, roomCode) => {
  return engineInterface().postOngoingMatchUseCase.create({ userId: userId, friendId: friendId, endDate: endDate, questionList: questionList, examId: examId, courseId: courseId, subjectId: subjectId, roomCode: roomCode })
}

exports.deleteOngoingMatch = async (ongoingMatchId) => {
  return engineInterface().deleteOngoingMatchUseCase.remove({ id: ongoingMatchId })
}

exports.updateOngoingMatch = async (ongoingMatchEntity) => {
  return engineInterface().putOngoingMatchUseCase.update({ ongoingMatchEntity: ongoingMatchEntity })
}

exports.getAllOngoingMatches = async () => {
  return engineInterface().getOngoingMatchUseCase.getAll()
}

exports.updateStatistic = async (statisticEntity) => {
  return engineInterface().putStatisticUseCase.update({ statisticEntity: statisticEntity })
}

exports.getGameContent = async () => {
  return engineInterface().getExamEntityUseCase.getAll()
}

exports.createNotification = async (notificationEntity) => {
  return engineInterface().postNotificationUseCase.create({ body: notificationEntity })
}

exports.updateNotification = async (notificationEntity) => {
  return engineInterface().putNotificationUseCase.update({ notificationEntity: notificationEntity })
}

exports.getFriendMatches = async (userId, friendId) => {
  return engineInterface().getFriendsMatchUseCase.getMatches({ userId: userId, friendId: friendId })
}

exports.getUnsolvedQuestions = async (userId, examId, courseId, subjectId, questionAmount) => {
  return engineInterface().getUnsolvedQuestionUseCase.getBatch({
    userId: userId,
    examId: examId,
    courseId: courseId,
    subjectId: subjectId,
    questionAmount: questionAmount
  })
}

exports.postUnsolvedQuestion = async (unsolvedQuestionEntity) => {
  return engineInterface().postUnsolvedQuestionUseCase.create({ unsolvedQuestionEntity: unsolvedQuestionEntity })
}

exports.deleteUnsolvedQuestion = async (userId, questionId) => {
  return engineInterface().deleteUnsolvedQuestionUseCase.destroy({ userId: userId, questionId: questionId })
}

exports.deleteAllUserGoals = async () => {
  return engineInterface().deleteUserGoalUseCase.deleteAll()
}
