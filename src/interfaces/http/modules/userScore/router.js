const Status = require('http-status')
const { Router } = require('express')
const moment = require('moment')
moment.locale('tr')

module.exports = ({
  getUserScoreUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  router.use(auth.authenticate())

  // Gets the user score from db
  router
    .get('/:userId', (req, res) => {
      getUserScoreUseCase
        .getOne({
          userId: req.params.userId,
          examId: req.query.examId,
          courseId: req.query.courseId,
          subjectId: req.query.subjectId
        })
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
