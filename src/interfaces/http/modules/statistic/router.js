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

  // Users can get their statistics here
  router
    .get('/:id', (req, res) => {
      getUseCase
        .getBatch({ userId: req.params.id })
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
    .get('/weekly/:id', (req, res) => {
      getUseCase
        .getWeeklyBatch({ userId: req.params.id, examId: req.query.examId, courseId: req.query.courseId, subjectId: req.query.subjectId })
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
    .get('/monthly/:id', (req, res) => {
      getUseCase
        .getMonthlyBatch({ userId: req.params.id, examId: req.query.examId, courseId: req.query.courseId, subjectId: req.query.subjectId })
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
    .get('/sixMonths/:id', (req, res) => {
      getUseCase
        .getLastSixMonthsBatch({ userId: req.params.id, examId: req.query.examId, courseId: req.query.courseId, subjectId: req.query.subjectId })
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
