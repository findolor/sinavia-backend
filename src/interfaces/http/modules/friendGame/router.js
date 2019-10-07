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
          body: `${req.body.username} seni oyuna çağırıyor.`,
          userId: req.body.id,
          roomCode: req.body.roomCode
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

  // TODO THIS WILL FIRE UP WHEN THE USER STARTS THE FRIEND GAME SOLO
  // TODO THIS WILL PROB BE INSIDE THE FRIEND ROOM
  // WRITTEN FOR TESTING
  router
    .post('/solo', (req, res) => {
      cronJob.makeFriendGameCronJob(req.body.userId, req.body.friendId, req.body.roomCode)
        .then(data => {
          res.status(Status.OK).json(Success(data))
        })
        .catch((error) => {
          logger.error(error.stack)
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  // This will fire up when the friend plays the game and the match finished
  // We will stop the cron job and make things accordingly
  // TODO THIS WILL PROB BE INSIDE THE FRIEND ROOM
  // WRITTEN FOR TESTING
  router
    .delete('/', (req, res) => {
      cronJob.stopOngoingMatchCron(req.query.ongoingMatchId)
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
