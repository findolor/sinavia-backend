const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  getUseCase,
  postUseCase,
  putUseCase,
  deleteUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  // router.use(auth.authenticate())

  router
    .post('/', (req, res) => {
      postUseCase
        .create({ body: req.body })
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
        .getOpponentFullInformation({ userId: req.params.userId, clientId: req.query.clientId })
        // Data contains a user's;
        // Friendships
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
            groupGameCount: 0
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
            STATISTICS.groupGameCount = userScore.dataValues.totalGroupGames
          })
          data.dataValues.winner.forEach(win => {
            if (win.dataValues.isMatchDraw) FRIENDMATCHES_DRAW.push(win.dataValues)
            else FRIENDMATCHES_WINNER.push(win.dataValues)
          })
          data.dataValues.loser.forEach(lose => {
            if (lose.dataValues.isMatchDraw) FRIENDMATCHES_DRAW.push(lose.dataValues)
            else FRIENDMATCHES_LOSER.push(lose.dataValues)
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

  /**
   * @swagger
   * /users:
   *   put:
   *     tags:
   *       - Users
   *     description: Update User
   *     security:
   *       - JWT: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: User's ID to update
   *         type: string
   *       - name: body
   *         description: User's Entity
   *         in: body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/user'
   *     responses:
   *       200:
   *         description: Successfully Updated
   *         schema:
   *           $ref: '#/definitions/user'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   *       400:
   *         $ref: '#/responses/BadRequest'
   */
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

  /**
   * @swagger
   * /users:
   *   delete:
   *     tags:
   *       - Users
   *     description: Delete User
   *     security:
   *       - JWT: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: User's ID to delete
   *         type: string
   *     responses:
   *       200:
   *         description: Successfully Deleted
   *         schema:
   *           $ref: '#/definitions/user'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
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
