const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  getUserNotificationUseCase,
  postUserNotificationUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  // router.use(auth.authenticate())

  // Gets the user notifications from db
  router
    .get('/:userId', (req, res) => {
      getUserNotificationUseCase
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

  router
    .post('/', (req, res) => {
      postUserNotificationUseCase
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
