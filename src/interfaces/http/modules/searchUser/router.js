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

  // Users send a keyword with their id to search for other users
  router
    .get('/', (req, res) => {
      getUseCase
        .getUserWithKeyword({ keyword: req.query.keyword, userId: req.query.userId })
        .then(data => {
          res.status(Status.OK).json(Success(data))
        })
        .catch((error) => {
          console.log(error)
          logger.error(error) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  return router
}
