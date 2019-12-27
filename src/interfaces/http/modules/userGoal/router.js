const Status = require('http-status')
const { Router } = require('express')
const moment = require('moment')
moment.locale('tr')

module.exports = ({
  getUserGoalUseCase,
  postUserGoalUseCase,
  deleteUserGoalUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  router.use(auth.authenticate())

  // Gets the user jokers from db
  router
    .get('/:userId', (req, res) => {
      getUserGoalUseCase
        .getBatch({ userId: req.params.userId })
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
    .post('/', (req, res) => {
      postUserGoalUseCase
        .create({ body: req.body })
        .then(data => {
          res.status(Status.OK).json(Success(data))
        })
        .catch((error) => {
          logger.error(error.stack)
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  router
    .delete('/', (req, res) => {
      deleteUserGoalUseCase
        .deleteGoal({ userId: req.query.userId, subjectId: req.query.subjectId })
        .then(data => {
          res.status(Status.OK).json(Success(data))
        })
        .catch((error) => {
          logger.error(error.stack)
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  return router
}
