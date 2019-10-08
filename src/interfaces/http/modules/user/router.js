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

  /**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     description: Create new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: User's Entity
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/user'
 *     responses:
 *       200:
 *         description: Successfully Created
 *         schema:
 *           $ref: '#/definitions/user'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 *       400:
 *         $ref: '#/responses/BadRequest'
 */
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

  /**
 * @swagger
 * definitions:
 *   user:
 *     properties:
 *       id:
 *         type: string
 *         format: uuid
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       middleName:
 *         type: string
 *       email:
 *         type: string
 *       roleId:
 *         type: number
 *       isDeleted:
 *         type: number
 *       createdBy:
 *         type: string
 *         format: uuid
 */

  router.use(auth.authenticate())

  /**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns a list of users
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/user'
 *       401:
 *        $ref: '#/responses/Unauthorized'
 */
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
        // Friendships
        // Statistics
        // Friend matches
        .then(data => {
          const FRIENDSHIPS = []
          const STATISTICS = {
            winCount: 0,
            loseCount: 0,
            drawCount: 0,
            totalGameCount: 0
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
            STATISTICS.winCount += userScore.dataValues.totalWin
            STATISTICS.loseCount += userScore.dataValues.totalLose
            STATISTICS.drawCount += userScore.dataValues.totalDraw
            STATISTICS.totalGameCount = userScore.dataValues.totalGames
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
