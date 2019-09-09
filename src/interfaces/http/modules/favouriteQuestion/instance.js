const container = require('src/container') // we have to get the DI
const { getFavouriteQuestion, postFavouriteQuestion } = require('src/app/favouriteQuestion')
const { getQuestion } = require('src/app/question')

module.exports = () => {
  const {
    repository: { favouriteQuestionRepository },
    repository: { questionRepository }
  } = container.cradle

  const getFavouriteQuestionUseCase = getFavouriteQuestion({ favouriteQuestionRepository })
  const postFavouriteQuestionUseCase = postFavouriteQuestion({ favouriteQuestionRepository })
  const getQuestionUseCase = getQuestion({ questionRepository })

  return {
    getFavouriteQuestionUseCase,
    postFavouriteQuestionUseCase,
    getQuestionUseCase
  }
}
