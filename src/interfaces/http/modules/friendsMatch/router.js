const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  getUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  router.use(auth.authenticate())

  // Users can get the number of matches they played as friends
  router
    .get('/', (req, res) => {
      getUseCase
        .getMatches({ userId: req.query.userId, friendId: req.query.friendId })
        .then(data => {
          res.status(Status.OK).json(Success(data))
        })
        .catch((error) => {
          logger.error(error) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  return router
}
