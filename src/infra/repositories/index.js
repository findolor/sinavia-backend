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

  return {
    userRepository: User({ model: userModel }),
    questionRepository: Question({ model: questionModel }),
    statisticRepository: Statistic({ model: statisticModel }),
    friendshipRepository: Friendship({ model: friendshipModel }),
    friendsMatchRepository: FriendsMatch({ model: friendsMatchModel }),
    favouriteQuestionRepository: FavouriteQuestion({ model: favouriteQuestionModel })
  }
}
