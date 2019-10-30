const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  getUseCase,
  postUseCase,
  putUseCase,
  deleteUseCase,
  getUserUseCase,
  postNotificationUseCase,
  logger,
  auth,
  fcmService,
  response: { Success, Fail }
}) => {
  const router = Router()

  router.use(auth.authenticate())

  // Gets the friendship status between two users
  router
    .get('/', (req, res) => {
      getUseCase
        .getFriendship({ userId: req.query.userId, friendId: req.query.friendId })
        .then(data => {
          res.status(Status.OK).json(Success(data))
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  // A user sends a post request to add another user as a friend
  router
    .post('/', (req, res) => {
      getUseCase
        .getFriendship({ userId: req.body.friendId, friendId: req.body.userId })
        .then(data => {
          // If there is already a request send by the other user we don't make another request
          if (Object.keys(data).length !== 0) {
            res.status(Status.BAD_REQUEST).json(Fail('Requested user has already requested a friendship'))
            return
          }
          // TODO Think about the structure here
          getUserUseCase
            .getOne({ id: req.body.friendId })
            .then(userData => {
              const { dataValues } = userData
              postUseCase
                .create({ body: req.body })
                .then(data => {
                  fcmService.sendNotificationDataMessage(
                    dataValues.fcmToken,
                    {
                      title: 'Arkadaş İsteği!',
                      body: `${req.body.username} seni arkadaş olarak ekledi.`
                    },
                    {
                      type: 'friendRequest',
                      userId: req.body.userId,
                      title: 'Arkadaş İsteği!',
                      body: `${req.body.username} seni arkadaş olarak ekledi.`
                    }
                  ).catch(error => {
                    logger.error(error)
                  })
                  res.status(Status.OK).json(Success(data))
                })
                .catch((error) => {
                  logger.error(error.stack)
                  res.status(Status.BAD_REQUEST).json(
                    Fail(error.message))
                })
            })
            .catch(error => {
              logger.error(error.stack)
              res.status(Status.BAD_REQUEST).json(
                Fail(error.message))
            })
        })
        .catch(error => {
          logger.error(error.stack)
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  // Gets all the friends that a user has
  router
    .get('/:id', (req, res) => {
      getUseCase
        .getFriends({ userId: req.params.id })
        .then(data => {
          const returnList = []

          data.forEach(friendship => {
            if (friendship.userId === req.params.id) returnList.push(friendship.friendId)
            else returnList.push(friendship.userId)
          })

          res.status(Status.OK).json(Success(returnList))
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  // Returns requested user friendship requests
  router
    .get('/requested/:id', (req, res) => {
      getUseCase
        .getFriendRequests({ userId: req.params.id })
        .then(data => {
          const returnList = []

          data.forEach(friendship => {
            if (friendship.userId === req.params.id) returnList.push(friendship.friendId)
            else returnList.push(friendship.userId)
          })

          res.status(Status.OK).json(Success(returnList))
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  // When a user accepts the friend request we update the friendship status here
  router
    .put('/', (req, res) => {
      getUserUseCase
        .getOne({ id: req.body.userId })
        .then(userData => {
          const { dataValues } = userData
          putUseCase
            .updateFriendship({ body: req.body })
            .then(data => {
              // Adding the notification to our db and then sending the notification to the user
              const notificationBody = {
                notificationType: 'friendshipAccepted',
                notificationData: JSON.stringify({
                  message: `${req.body.username} arkadaşlık isteğini kabul etti.`,
                  profilePicture: dataValues.profilePicture,
                  userId: req.body.friendId
                }),
                userId: req.body.userId
              }
              // TODO Think about the structure here
              postNotificationUseCase
                .create({ body: notificationBody })
                .then(notification => {
                  try {
                    fcmService.sendNotificationOnlyMessage(
                      dataValues.fcmToken,
                      {
                        title: 'Arkadaş İsteği!',
                        body: `${req.body.username} arkadaşlık isteğini kabul etti.`
                      }
                    )
                    fcmService.sendDataMessage(
                      dataValues.fcmToken,
                      {
                        type: 'friendApproved',
                        title: 'Arkadaş İsteği!',
                        body: `${req.body.username} arkadaşlık isteğini kabul etti.`,
                        userId: req.body.friendId
                      }
                    )
                  } catch (error) {
                    logger.error(error)
                  }
                  res.status(Status.OK).json(Success(data))
                })
            })
            .catch((error) => {
              logger.error(error.stack) // we still need to log every error for debugging
              res.status(Status.BAD_REQUEST).json(
                Fail(error.message))
            })
        })
    })

  // If a user removes another user from friends the record is destroyed
  router
    .delete('/', (req, res) => {
      const isClientUser = JSON.parse(req.query.isClientUser)
      getUserUseCase
        .getOne({ id: isClientUser === true ? req.query.friendId : req.query.userId })
        .then(userData => {
          deleteUseCase
            .deleteFriendship({ userId: req.query.userId, friendId: req.query.friendId })
            .then(data => {
              try {
                fcmService.sendDataMessage(
                  userData.fcmToken,
                  {
                    type: 'friendDeleted',
                    userId: isClientUser === true ? req.query.userId : req.query.friendId
                  }
                )
              } catch (error) {
                logger.error(error.stack)
              }
              res.status(Status.OK).json(Success(data))
            })
            .catch((error) => {
              logger.error(error.stack) // we still need to log every error for debugging
              res.status(Status.BAD_REQUEST).json(
                Fail(error.message))
            })
        })
    })

  router
    .delete('/reject/', (req, res) => {
      deleteUseCase
        .deleteFriendship({ userId: req.query.userId, friendId: req.query.friendId })
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
