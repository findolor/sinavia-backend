const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  getQuestionUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  router.use(auth.authenticate())

  // TODO This probably will be removed
  router
    .get('/info', (req, res) => {
      getQuestionUseCase
        .getMultiple({
          examId: req.query.examId,
          courseId: req.query.courseId,
          subjectId: req.query.subjectId,
          questionAmount: req.query.questionAmount
        })
        .then(data => {
          res.status(Status.OK).json(Success(data))
        })
        .catch(error => {
          logger.error(error.stack)
          res.status(Status.BAD_REQUEST).json(Fail(error.message))
        })
    })
  return router
}
