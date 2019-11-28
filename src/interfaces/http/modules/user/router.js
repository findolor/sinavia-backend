const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  getUseCase,
  postUseCase,
  putUseCase,
  deleteUseCase,
  getFriendsMatchUseCase,
  // postGameEnergyUseCase,
  postUserJokerUseCase,
  logger,
  auth,
  smtpService,
  config,
  response: { Success, Fail }
}) => {
  const router = Router()

  router
    .post('/password/reset', (req, res) => {
      getUseCase
        .getOneWithEmail({ email: req.body.email })
        .then(user => {
          if (user === null) {
            res.status(Status.BAD_REQUEST).json(Fail('Invalid User'))
            return
          }
          const { dataValues } = user
          user = dataValues

          // Changing the password with the new one
          const newPassword = Math.random().toString(36).substr(2, 10)
          user.password = newPassword

          config.fcm.firebaseAdmin.auth().getUserByEmail(req.body.email).then(firebaseUser => {
            config.fcm.firebaseAdmin.auth().updateUser(firebaseUser.uid, {
              password: newPassword
            }).then(() => {
              putUseCase
                .updateUser({ id: user.id, body: user })
                .then(() => {
                  smtpService.sendEmail(
                    req.body.email,
                    'Sınavia şifre değişimi',
                    `Yeni Sınavia şifren ${newPassword}`
                  )

                  res.status(Status.OK).json(Success(true))
                })
                .catch((error) => {
                  logger.error(error.stack) // we still need to log every error for debugging
                  res.status(Status.BAD_REQUEST).json(
                    Fail(error.message))
                })
            })
              .catch((error) => {
                logger.error(error.stack) // we still need to log every error for debugging
                res.status(Status.BAD_REQUEST).json(
                  Fail(error.message))
              })
          })
            .catch((error) => {
              logger.error(error.stack) // we still need to log every error for debugging
              res.status(Status.BAD_REQUEST).json(
                Fail(error.message))
            })
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  router
    .post('/', (req, res) => {
      postUseCase
        .create({ body: req.body })
        .then(data => {
          // This will be used later on
          /* const gameEnergyEntity = {
            userId: data.id,
            energyAmount: 6,
            energyUsed: 0,
            shouldRenew: false,
            dateRenewed: new Date()
          } */
          /* postGameEnergyUseCase
            .create({ body: gameEnergyEntity })
            .then(() => {
              res.status(Status.OK).json(Success(data))
            })
            .catch((error) => {
              logger.error(error.stack) // we still need to log every error for debugging
              res.status(Status.BAD_REQUEST).json(
                Fail(error.message))
            }) */

          for (let i = 1; i < 4; i++) {
            postUserJokerUseCase
              .createUserJoker({ userJokerEntity: {
                userId: data.id,
                jokerId: i,
                amount: 10,
                amountUsed: 0,
                shouldRenew: false,
                dateRenewed: new Date()
              } })
          }

          delete data.createdAt
          delete data.updatedAt

          res.status(Status.OK).json(Success(data))
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  router.use(auth.authenticate())

  router
    .get('/:id', (req, res) => {
      getUseCase
        .getOne({ id: req.params.id })
        .then(data => {
          const { dataValues } = data
          res.status(Status.OK).json(Success(dataValues))
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  router
    .get('/opponent/:userId', (req, res) => {
      getUseCase
        .getOpponentFullInformation({ userId: req.params.userId })
        // Data contains a user's;
        // Statistics
        // Friend matches
        .then(data => {
          const FRIENDSHIPS = []
          const STATISTICS = {
            rankedWinCount: 0,
            rankedLoseCount: 0,
            rankedDrawCount: 0,
            friendWinCount: 0,
            friendLoseCount: 0,
            friendDrawCount: 0,
            groupGameCount: 0,
            soloGameCount: 0
          }
          const FRIENDMATCHES_WINNER = []
          const FRIENDMATCHES_LOSER = []
          const FRIENDMATCHES_DRAW = []
          let isFriend = false
          let isRequesting = false
          let isRequested = false

          data.dataValues.user.forEach(friendship => {
            if (friendship.dataValues.friendId === req.query.clientId) {
              if (friendship.dataValues.friendshipStatus === 'approved') {
                isFriend = true
                isRequesting = true
              } else isRequesting = true
            }
            FRIENDSHIPS.push(friendship.dataValues)
          })
          data.dataValues.friend.forEach(friendship => {
            if (friendship.dataValues.userId === req.query.clientId) {
              if (friendship.dataValues.friendshipStatus === 'approved') {
                isFriend = true
                isRequested = true
              } else isRequested = true
            }
            FRIENDSHIPS.push(friendship.dataValues)
          })
          data.dataValues.userScores.forEach(userScore => {
            STATISTICS.rankedWinCount += userScore.dataValues.totalRankedWin
            STATISTICS.rankedLoseCount += userScore.dataValues.totalRankedLose
            STATISTICS.rankedDrawCount += userScore.dataValues.totalRankedDraw
            STATISTICS.friendWinCount += userScore.dataValues.totalFriendWin
            STATISTICS.friendLoseCount += userScore.dataValues.totalFriendLose
            STATISTICS.friendDrawCount += userScore.dataValues.totalFriendDraw
            STATISTICS.groupGameCount += userScore.dataValues.totalGroupGames
            STATISTICS.soloGameCount += userScore.dataValues.totalSoloGames
          })

          getFriendsMatchUseCase
            .getMatches({ userId: req.params.userId, friendId: req.query.clientId })
            .then(friendMatches => {
              friendMatches.forEach(friendMatch => {
                if (friendMatch.isMatchDraw) FRIENDMATCHES_DRAW.push(friendMatch)
                else if (friendMatch.winnerId === req.query.clientId) {
                  FRIENDMATCHES_WINNER.push(friendMatch)
                } else FRIENDMATCHES_LOSER.push(friendMatch)
              })
              const returnData = {
                isFriend: isFriend,
                isRequesting: isRequesting,
                isRequested: isRequested,
                friendships: FRIENDSHIPS,
                statistics: STATISTICS,
                friendGameWins: FRIENDMATCHES_WINNER,
                friendGameDefeats: FRIENDMATCHES_LOSER,
                friendGameDraws: FRIENDMATCHES_DRAW
              }

              res.status(Status.OK).json(Success(returnData))
            })
            .catch((error) => {
              logger.error(error.stack) // we still need to log every error for debugging
              res.status(Status.BAD_REQUEST).json(
                Fail(error.message))
            })
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  router
    .get('/', (req, res) => {
      getUseCase
        .getMultiple({ idList: req.query.idList })
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
    .put('/:id', (req, res) => {
      putUseCase
        .updateUser({ id: req.params.id, body: req.body })
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
    .delete('/:id', (req, res) => {
      deleteUseCase
        .remove({ id: req.params.id })
        .then(data => {
          res.status(Status.OK).json(Success(data))
        })
        .catch((error) => {
          // TODO check error format
          logger.error(error) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })
  return router
}
