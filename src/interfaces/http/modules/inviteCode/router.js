const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  getInviteCodeUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  router.use(auth.authenticate())

  router
    .get('/:userId', (req, res) => {
      getInviteCodeUseCase
        .getBatch({ userId: req.params.userId })
        .then(data => {
          if (Object.keys(data).length !== 0) {
            res.status(Status.OK).json(Success({
              code: data[0].code,
              remainingCodes: Object.keys(data).length
            }))
          } else {
            res.status(Status.OK).json(Success({
              remainingCodes: Object.keys(data).length
            }))
          }
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  return router
}
