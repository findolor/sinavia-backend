const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  fcmService,
  getOngoingMatchUseCase,
  logger,
  auth,
  response: { Success, Fail },
  cronJob
}) => {
  const router = Router()

  router.use(auth.authenticate())

  router
    .post('/request', (req, res) => {
      fcmService.sendNotificationDataMessage(
        req.body.requestedUserFCMToken,
        {
          title: 'Arkadaş oyun isteği!',
          body: `${req.body.username} seni oyuna çağırıyor!`
        },
        {
          type: 'friendGameRequest',
          username: req.body.username,
          userId: req.body.id,
          roomCode: req.body.roomCode,
          examId: req.body.matchInformation.examId.toString(),
          courseId: req.body.matchInformation.courseId.toString(),
          subjectId: req.body.matchInformation.subjectId.toString()
        }
      )
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
    .get('/check/:userId', (req, res) => {
      getOngoingMatchUseCase
        .checkOngoingMatch({ userId: req.params.userId, roomCode: req.query.roomCode })
        .then(data => {
          if (data !== null) res.status(Status.OK).json(Success(true))
          else res.status(Status.OK).json(Success(false))
        })
        .catch((error) => {
          logger.error(error.stack)
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  router
    .delete('/:ongoingMatchId', (req, res) => {
      const ongoingMatchId = parseInt(req.params.ongoingMatchId, 10)
      cronJob.stopOngoingMatchCron(ongoingMatchId, false)
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
