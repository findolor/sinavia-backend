const container = require('src/container') // we have to get the DI
const { getFavouriteQuestion, postFavouriteQuestion, deleteFavouriteQuestion } = require('src/app/favouriteQuestion')
const { getQuestion } = require('src/app/question')

module.exports = () => {
  const {
    repository: { favouriteQuestionRepository },
    repository: { questionRepository },
    database
  } = container.cradle

  const getFavouriteQuestionUseCase = getFavouriteQuestion({ favouriteQuestionRepository, database })
  const postFavouriteQuestionUseCase = postFavouriteQuestion({ favouriteQuestionRepository })
  const deleteFavouriteQuestionUseCase = deleteFavouriteQuestion({ favouriteQuestionRepository })
  const getQuestionUseCase = getQuestion({ questionRepository })

  return {
    getFavouriteQuestionUseCase,
    postFavouriteQuestionUseCase,
    deleteFavouriteQuestionUseCase,
    getQuestionUseCase
  }
}
