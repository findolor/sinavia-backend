const User = require('./user')
const Question = require('./question')
const Statistic = require('./statistic')
const Friendship = require('./friendship')
const FriendsMatch = require('./friendsMatch')
const FavouriteQuestion = require('./favouriteQuestion')

module.exports = ({ database }) => {
  const userModel = database.models.users
  const questionModel = database.models.questions
  const statisticModel = database.models.statistics
  const friendshipModel = database.models.friendships
  const friendsMatchModel = database.models.friendsMatches
  const favouriteQuestionModel = database.models.favouriteQuestions

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

  return {
    userRepository: User({ model: userModel }),
    questionRepository: Question({ model: questionModel }),
    statisticRepository: Statistic({ model: statisticModel }),
    friendshipRepository: Friendship({ model: friendshipModel }),
    friendsMatchRepository: FriendsMatch({ model: friendsMatchModel }),
    favouriteQuestionRepository: FavouriteQuestion({ model: favouriteQuestionModel })
  }
}
