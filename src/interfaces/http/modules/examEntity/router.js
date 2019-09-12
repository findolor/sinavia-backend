const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  getExamEntityUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  // router.use(auth.authenticate())

  // Gets one exam entity from db
  router
    .get('/:examId', (req, res) => {
      getExamEntityUseCase
        .getOne({ examId: req.params.examId })
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
    .get('/:examId/full', (req, res) => {
      getExamEntityUseCase
        .getFullExamInformation({ examId: req.params.examId })
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
