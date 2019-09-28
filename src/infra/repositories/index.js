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
const UserNotification = require('./userNotification')

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
  const userNotificationModel = database.models.userNotifications

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
  friendsMatchModel.belongsTo(userModel, { as: 'winner' })
  friendsMatchModel.belongsTo(userModel, { as: 'loser' })

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
    userNotificationRepository: UserNotification({ model: userNotificationModel })
  }
}
