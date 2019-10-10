const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  fcmService,
  logger,
  auth,
  response: { Success, Fail },
  cronJob
}) => {
  const router = Router()

  // router.use(auth.authenticate())

  router
    .post('/request', (req, res) => {
      fcmService.sendDataMessage(
        req.body.requestedUserFCMToken,
        {
          type: 'friendGameRequest',
          title: 'Arkadaş oyun isteği!',
          body: `${req.body.username} seni oyuna çağırıyor!`,
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

  return router
}
