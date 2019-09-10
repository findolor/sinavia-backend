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
const ExamName = require('./examName')
const CourseName = require('./courseName')
const SubjectName = require('./subjectName')

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
  const examNameModel = database.models.examNames
  const courseNameModel = database.models.courseNames
  const subjectNameModel = database.models.subjectNames

  // USER has many statistics 1-N
  // STATISTIC belongs to one user 1-1
  userModel.hasMany(statisticModel)
  statisticModel.belongsTo(userModel)

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
    examNameRepository: ExamName({ model: examNameModel }),
    courseNameRepository: CourseName({ model: courseNameModel }),
    subjectNameRepository: SubjectName({ model: subjectNameModel })
  }
}
