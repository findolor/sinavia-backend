const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  // getReportedUserUseCase,
  postReportedUserUseCase,
  postReportedQuestionUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  router.use(auth.authenticate())

  router
    .post('/', (req, res) => {
      postReportedUserUseCase
        .create({ body: req.body })
        .then(() => {
          res.status(Status.OK).json(Success(true))
        })
        .catch((error) => {
          logger.error(error.stack)
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  router
    .post('/question', (req, res) => {
      postReportedQuestionUseCase
        .create({ body: req.body })
        .then(() => {
          res.status(Status.OK).json(Success(true))
        })
        .catch((error) => {
          logger.error(error.stack)
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  return router
}
