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

  // router.use(auth.authenticate())

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
        .getFriendScores({ userIdList: req.query.userIdList })
        .then(data => {
          const scores = []

          // TODO Again this null check will be deleted in production
          data.forEach(userScore => {
            if (userScore.user !== null) {
              let { dataValues } = userScore.user
              userScore.user = dataValues

              delete userScore.user.password
              delete userScore.user.city
              delete userScore.user.totalPoints
              delete userScore.user.fcmToken
              delete userScore.user.deviceId
              delete userScore.user.email
              delete userScore.user.birthDate
              delete userScore.user.coverPicture
              delete userScore.user.name
              delete userScore.user.lastname
            } else {
              userScore.user = {
                id: userScore.userId,
                username: userScore.userId.substring(0, 8),
                profilePicture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTahJbOytdJpTgUSiOKKpoayRwgfYMXnMg2Pk6UOvvoeGey-yQF'
              }
            }

            scores.push(userScore)
          })

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
