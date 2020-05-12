const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  getLeaderboardUseCase,
  getUserScoreUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  router.use(auth.authenticate())

  router.get('/global', (req, res) => {
    getLeaderboardUseCase
      .getOne({ examId: req.query.examId, courseId: req.query.courseId, subjectId: req.query.subjectId })
      .then(data => {
        res.status(Status.OK).json(Success(data))
      })
      .catch(error => {
        logger.error(error.stack)
        res.status(Status.BAD_REQUEST).json(Fail(error.message))
      })
  })

  // Getting the friends user scores
  router
    .get('/friends', (req, res) => {
      getUserScoreUseCase
        .getFriendScores({ userIdList: req.query.userIdList, clientId: req.query.clientId, examId: req.query.examId, courseId: req.query.courseId, subjectId: req.query.subjectId })
        .then(data => {
          const userList = {}

          data.forEach(userScore => {
            if (userScore.totalPoints === 0) return
            const leaderboardEntity = {
              totalPoints: null,
              username: null,
              profilePicture: null,
              id: null
            }

            let { dataValues } = userScore.user
            userScore.user = dataValues

            leaderboardEntity.username = userScore.user.username
            leaderboardEntity.profilePicture = userScore.user.profilePicture
            leaderboardEntity.id = userScore.user.id
            leaderboardEntity.totalPoints = userScore.totalPoints

            if (userList[userScore.userId] === undefined) {
              userList[userScore.userId] = leaderboardEntity
            } else {
              userList[userScore.userId].totalPoints += leaderboardEntity.totalPoints
            }
          })

          const tempList = Object.values(userList)
          tempList.sort((a, b) => (a.totalPoints < b.totalPoints) ? 1 : -1)

          const leaderboardList = []

          tempList.forEach(score => {
            leaderboardList.push(JSON.stringify(score))
          })

          res.status(Status.OK).json(Success({
            userList: leaderboardList
          }))
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  return router
}
