const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  getCourseEntityUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  // router.use(auth.authenticate())

  // Gets one course entity from db
  router
    .get('/:courseId', (req, res) => {
      getCourseEntityUseCase
        .getOne({ courseId: req.params.courseId })
        .then(data => {
          res.status(Status.OK).json(Success(data))
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  // Gets one course and subjects entity from db
  router
    .get('/:courseId/full', (req, res) => {
      getCourseEntityUseCase
        .getFullCourseInformation({ courseId: req.params.courseId })
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
