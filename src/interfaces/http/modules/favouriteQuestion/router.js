const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  getFavouriteQuestionUseCase,
  postFavouriteQuestionUseCase,
  getQuestionUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  // router.use(auth.authenticate())

  // Gets all the faved questions from db
  router
    .get('/:userId', (req, res) => {
      getFavouriteQuestionUseCase
        .getBatch({ userId: req.params.userId })
        .then(data => {
          const idList = []
          data.forEach(favouriteQuestion => {
            idList.push(favouriteQuestion.questionId)
          })

          getQuestionUseCase
            .getBatchById({ idList: idList })
            .then(data => {
              res.status(Status.OK).json(Success(data))
            })
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  // Posts a faved question to db
  router
    .post('/', (req, res) => {
      postFavouriteQuestionUseCase
        .create({ body: req.body })
        .then(data => {
          res.status(Status.OK).json(Success(data))
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  return router
}
