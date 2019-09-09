const { FavouriteQuestion } = require('src/domain/favouriteQuestion')

module.exports = ({ favouriteQuestionRepository }) => {
  const create = ({ body }) => {
    return Promise.resolve().then(() => {
      const entity = Object.assign({}, {
        userId: body.userId,
        questionId: body.questionId
      })
      const favouriteQuestion = FavouriteQuestion(entity)

      return favouriteQuestionRepository.create(favouriteQuestion)
    })
  }

  return {
    create
  }
}
