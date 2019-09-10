const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  getUserBadgeUseCase,
  postUserBadgeUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  router.use(auth.authenticate())

  // Gets the user badges from db
  router
    .get('/:userId', (req, res) => {
      getUserBadgeUseCase
        .getBatch({ userId: req.params.userId })
        .then(data => {
          res.status(Status.OK).json(Success(data))
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  // Posts a won user badge to
  // TODO Think if we need this endpoint in our api
  router
    .post('/', (req, res) => {
      postUserBadgeUseCase
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
