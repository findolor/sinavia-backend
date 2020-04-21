const User = require('./user')
const Question = require('./question')
const Statistic = require('./statistic')
const Friendship = require('./friendship')
const FriendsMatch = require('./friendsMatch')
const FavouriteQuestion = require('./favouriteQuestion')
const UserScore = require('./userScore')
const Badge = require('./badge')
const UserBadge = require('./userBadge')
const Joker = require('./joker')
const ExamEntity = require('./examEntity')
const CourseEntity = require('./courseEntity')
const SubjectEntity = require('./subjectEntity')
const UserJoker = require('./userJoker')
const Notification = require('./notification')
const Leaderboard = require('./leaderboard')
const OngoingMatch = require('./ongoingMatch')
const GameEnergy = require('./gameEnergy')
const UnsolvedQuestion = require('./unsolvedQuestion')
const UserGoal = require('./userGoal')
const PurchaseReceipt = require('./purchaseReceipt')
const InviteCode = require('./inviteCode')
const AppleIdentityToken = require('./appleIdentityToken')
const ReportedUser = require('./reportedUser')

module.exports = ({ database }) => {
  const userModel = database.models.users
  const questionModel = database.models.questions
  const statisticModel = database.models.statistics
  const friendshipModel = database.models.friendships
  const friendsMatchModel = database.models.friendsMatches
  const favouriteQuestionModel = database.models.favouriteQuestions
  const userScoreModel = database.models.userScores
  const badgeModel = database.models.badges
  const userBadgeModel = database.models.userBadges
  const jokerModel = database.models.jokers
  const examEntityModel = database.models.examEntities
  const courseEntityModel = database.models.courseEntities
  const subjectEntityModel = database.models.subjectEntities
  const userJokerModel = database.models.userJokers
  const notificationModel = database.models.notifications
  const leaderboardModel = database.models.leaderboards
  const ongoingMatchModel = database.models.ongoingMatches
  const gameEnergyModel = database.models.gameEnergies
  const unsolvedQuestionModel = database.models.unsolvedQuestions
  const userGoalModel = database.models.userGoals
  const purchaseReceiptModel = database.models.purchaseReceipts
  const inviteCodeModel = database.models.inviteCodes
  const appleIdentityTokenModel = database.models.appleIdentityTokens
  const reportedUserModel = database.models.reportedUsers

  // USER has many STATISTICs 1-N
  // STATISTIC belongs to one user 1-1
  userModel.hasMany(statisticModel, { foreignKey: 'userId' })
  statisticModel.belongsTo(userModel, { foreignKey: 'userId' })

  // FAVOURITE_QUESTION belongs to one user and question 1-1
  // USER has many questions M-N
  // QUESTION has many users M-N
  userModel.belongsToMany(questionModel, { through: favouriteQuestionModel })
  questionModel.belongsToMany(userModel, { through: favouriteQuestionModel })
  favouriteQuestionModel.belongsTo(userModel)
  favouriteQuestionModel.belongsTo(questionModel)

  // USER_BADGE belongs to one user and badge 1-1
  // USER has many badges M-N
  // BADGE has many users M-N
  userModel.belongsToMany(badgeModel, { through: userBadgeModel })
  badgeModel.belongsToMany(userModel, { through: userBadgeModel })
  userBadgeModel.belongsTo(userModel)
  userBadgeModel.belongsTo(badgeModel)

  // FRIENDSHIP belongs to users
  // USER has many other USERs as friends
  userModel.hasMany(friendshipModel, { as: 'user', foreignKey: 'userId' })
  userModel.hasMany(friendshipModel, { as: 'friend', foreignKey: 'friendId' })
  friendshipModel.belongsTo(userModel, { as: 'user' })
  friendshipModel.belongsTo(userModel, { as: 'friend' })

  // FRIENDS_MATCH belongs to users
  // USER has many matches with other USERS
  userModel.hasMany(friendsMatchModel, { as: 'winner', foreignKey: 'winnerId' })
  userModel.hasMany(friendsMatchModel, { as: 'loser', foreignKey: 'loserId' })
  friendsMatchModel.belongsTo(userModel, { as: 'winner', foreignKey: 'winnerId' })
  friendsMatchModel.belongsTo(userModel, { as: 'loser', foreignKey: 'loserId' })

  // EXAM has many COURSEs
  // COURSEs belongs to EXAM
  examEntityModel.hasMany(courseEntityModel, { foreignKey: 'examId' })
  courseEntityModel.belongsTo(examEntityModel, { foreignKey: 'examId' })

  // COURSE has many SUBJECTs
  // SUBJECTs belongs to COURSE
  courseEntityModel.hasMany(subjectEntityModel, { foreignKey: 'courseId' })
  subjectEntityModel.belongsTo(courseEntityModel, { foreignKey: 'courseId' })

  // EXAM has many QUESTIONs
  // QUESTION belongs to EXAM
  examEntityModel.hasMany(questionModel, { foreignKey: 'examId' })
  questionModel.belongsTo(examEntityModel, { foreignKey: 'examId' })

  // COURSE has many QUESTIONs
  // QUESTION belongs to COURSE
  courseEntityModel.hasMany(questionModel, { foreignKey: 'courseId' })
  questionModel.belongsTo(courseEntityModel, { foreignKey: 'courseId' })

  // SUBJECT has many QUESTIONs
  // QUESTION belongs to SUBJECT
  subjectEntityModel.hasMany(questionModel, { foreignKey: 'subjectId' })
  questionModel.belongsTo(subjectEntityModel, { foreignKey: 'subjectId' })

  // EXAM has many STATISTICs
  // STATISTIC belongs to EXAM
  examEntityModel.hasMany(statisticModel, { foreignKey: 'examId' })
  statisticModel.belongsTo(examEntityModel, { foreignKey: 'examId' })

  // COURSE has many STATISTICs
  // STATISTIC belongs to COURSE
  courseEntityModel.hasMany(statisticModel, { foreignKey: 'courseId' })
  statisticModel.belongsTo(courseEntityModel, { foreignKey: 'courseId' })

  // SUBJECT has many STATISTICs
  // STATISTIC belongs to SUBJECT
  subjectEntityModel.hasMany(statisticModel, { foreignKey: 'subjectId' })
  statisticModel.belongsTo(subjectEntityModel, { foreignKey: 'subjectId' })

  // USER has many USER_SCOREs
  // USER_SCORE belongs to USER
  userModel.hasMany(userScoreModel, { foreignKey: 'userId' })
  userScoreModel.belongsTo(userModel, { foreignKey: 'userId' })

  // USER has many USER_JOKERs
  // USER_JOKER belongs to USER
  userModel.hasMany(userJokerModel, { foreignKey: 'userId' })
  userJokerModel.belongsTo(userModel, { foreignKey: 'userId' })

  // JOKER has many USER_JOKERs
  // USER_JOKER belongs to JOKER
  jokerModel.hasMany(userJokerModel, { foreignKey: 'jokerId' })
  userJokerModel.belongsTo(jokerModel, { foreignKey: 'jokerId' })

  // ONGOING_MATCH belongs to USERs
  // USERs has many matches with other USERs
  userModel.hasMany(ongoingMatchModel, { as: 'ongoingMatchUser', foreignKey: 'userId' })
  userModel.hasMany(ongoingMatchModel, { as: 'ongoingMatchFriend', foreignKey: 'friendId' })
  ongoingMatchModel.belongsTo(userModel, { as: 'ongoingMatchUser', foreignKey: 'userId' })
  ongoingMatchModel.belongsTo(userModel, { as: 'ongoingMatchFriend', foreignKey: 'friendId' })

  // ONGOING_MATCH belongs to STATISTICs
  statisticModel.hasMany(ongoingMatchModel, { as: 'ongoingMatchUserStatistics', foreignKey: 'userResults' })
  statisticModel.hasMany(ongoingMatchModel, { as: 'ongoingMatchFriendStatistics', foreignKey: 'friendResults' })
  ongoingMatchModel.belongsTo(statisticModel, { as: 'ongoingMatchUserStatistics', foreignKey: 'userResults' })
  ongoingMatchModel.belongsTo(statisticModel, { as: 'ongoingMatchFriendStatistics', foreignKey: 'friendResults' })

  // USER has many NOTIFICATIONs
  // NOTIFICATION belongs to one USER
  userModel.hasMany(notificationModel, { foreignKey: 'userId' })
  notificationModel.belongsTo(userModel, { foreignKey: 'userId' })

  // USER has many GAME_ENERGYs
  // GAME_ENERGY belongs to one USER
  userModel.hasMany(gameEnergyModel, { foreignKey: 'userId' })
  gameEnergyModel.belongsTo(userModel, { foreignKey: 'userId' })

  // WRONG_ANSWERED_QUESTION belongs to one user and question 1-1
  // USER has many questions M-N
  // QUESTION has many users M-N
  userModel.belongsToMany(questionModel, { through: unsolvedQuestionModel })
  questionModel.belongsToMany(userModel, { through: unsolvedQuestionModel })
  unsolvedQuestionModel.belongsTo(userModel)
  unsolvedQuestionModel.belongsTo(questionModel)

  // USER has many USER_GOALs
  // USER_GOAL belongs to one USER
  userModel.hasMany(userGoalModel, { foreignKey: 'userId' })
  userGoalModel.belongsTo(userModel, { foreignKey: 'userId' })

  // USER has many INVITE_CODEs
  // INVITE_CODE belongs to one USER
  userModel.hasMany(inviteCodeModel, { foreignKey: 'userId' })
  inviteCodeModel.belongsTo(userModel, { foreignKey: 'userId' })

  // USER has one APPLE_IDENTITY_TOKEN
  // APPLE_IDENTITY_TOKEN belongs to one USER
  userModel.hasMany(appleIdentityTokenModel, { foreignKey: 'userId' })
  appleIdentityTokenModel.belongsTo(userModel, { foreignKey: 'userId' })

  // USER has many PURCHASE_RECEIPTs
  // PURCHASE_RECEIPT belongs to one USER
  userModel.hasMany(purchaseReceiptModel, { foreignKey: 'userId' })
  purchaseReceiptModel.belongsTo(userModel, { foreignKey: 'userId' })

  // REPORTS belongs to users
  userModel.hasMany(friendshipModel, { as: 'reporting', foreignKey: 'reportingUserId' })
  userModel.hasMany(friendshipModel, { as: 'reported', foreignKey: 'reportedUserId' })
  friendshipModel.belongsTo(userModel, { as: 'reporting' })
  friendshipModel.belongsTo(userModel, { as: 'reported' })

  return {
    userRepository: User({ model: userModel }),
    questionRepository: Question({ model: questionModel }),
    statisticRepository: Statistic({ model: statisticModel }),
    friendshipRepository: Friendship({ model: friendshipModel }),
    friendsMatchRepository: FriendsMatch({ model: friendsMatchModel }),
    favouriteQuestionRepository: FavouriteQuestion({ model: favouriteQuestionModel }),
    userScoreRepository: UserScore({ model: userScoreModel }),
    badgeRepository: Badge({ model: badgeModel }),
    userBadgeRepository: UserBadge({ model: userBadgeModel }),
    jokerRepository: Joker({ model: jokerModel }),
    examEntityRepository: ExamEntity({ model: examEntityModel }),
    courseEntityRepository: CourseEntity({ model: courseEntityModel }),
    subjectEntityRepository: SubjectEntity({ model: subjectEntityModel }),
    userJokerRepository: UserJoker({ model: userJokerModel }),
    notificationRepository: Notification({ model: notificationModel }),
    leaderboardRepository: Leaderboard({ model: leaderboardModel }),
    ongoingMatchRepository: OngoingMatch({ model: ongoingMatchModel }),
    gameEnergyRepository: GameEnergy({ model: gameEnergyModel }),
    unsolvedQuestionRepository: UnsolvedQuestion({ model: unsolvedQuestionModel }),
    userGoalRepository: UserGoal({ model: userGoalModel }),
    purchaseReceiptRepository: PurchaseReceipt({ model: purchaseReceiptModel }),
    inviteCodeRepository: InviteCode({ model: inviteCodeModel }),
    appleIdentityTokenRepository: AppleIdentityToken({ model: appleIdentityTokenModel }),
    reportedUserRepository: ReportedUser({ model: reportedUserModel })
  }
}
