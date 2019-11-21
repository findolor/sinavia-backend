const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  getWrongAnsweredQuestionUseCase,
  logger,
  response: { Success, Fail }
}) => {
  const router = Router()

  router
    .get('/:userId', (req, res) => {
      getWrongAnsweredQuestionUseCase
        .getBatch({
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
