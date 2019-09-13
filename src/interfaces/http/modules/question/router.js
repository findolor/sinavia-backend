const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  getQPicURLUseCase,
  getQuestionUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  // router.use(auth.authenticate())

  router.get('/', (req, res) => {
    getQPicURLUseCase
      .getQPicURL({ key: req.query.key })
      .then(data => {
        res.status(Status.OK).json(Success(data))
      })
      .catch(error => {
        logger.error(error.stack)
        res.status(Status.BAD_REQUEST).json(Fail(error.message))
      })
  })

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
