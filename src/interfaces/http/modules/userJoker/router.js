const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  getUserJokerUseCase,
  postUserJokerUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  // router.use(auth.authenticate())

  // Gets the user jokers from db
  router
    .get('/:userId', (req, res) => {
      getUserJokerUseCase
        .getJokers({ userId: req.params.userId })
        .then(data => {
          res.status(Status.OK).json(Success(data))
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  // Posts a joker to db
  // TODO this cannot go into wrong hands lol
  router
    .post('/', (req, res) => {
      postUserJokerUseCase
        .create({ body: req.body })
        .then(data => {
          res.status(Status.OK).json(Success(data))
        })
        .catch((error) => {
          logger.error(error.stack)
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  return router
}
