const statusMonitor = require('express-status-monitor')
const cors = require('cors')
const bodyParser = require('body-parser')
const compression = require('compression')

const { Router } = require('express')
const { partialRight } = require('ramda')

const controller = require('./utils/create_controller')
const httpLogger = require('./middlewares/http_logger')
const errorHandler = require('./middlewares/error_handler')

module.exports = ({ config, logger, database }) => {
  const router = Router()

  /* istanbul ignore if */
  if (config.env === 'development') {
    router.use(statusMonitor())
  }

  /* istanbul ignore if */
  if (config.env !== 'production') {
    router.use(httpLogger(logger))
  }

  const apiRouter = Router()

  apiRouter
    .use(cors({
      origin: [
        'http://localhost:4000'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }))
    .use(bodyParser.json())
    .use(compression())

  /*
   * Add your API routes here
   *
   * You can use the `controllers` helper like this:
   * apiRouter.use('/users', controller(controllerPath))
   *
   * The `controllerPath` is relative to the `interfaces/http` folder
   */

  apiRouter.use('/', controller('index'))
  apiRouter.use('/token', controller('token').router)
  apiRouter.use('/users', controller('user').router)
  apiRouter.use('/friendships', controller('friendship').router)
  apiRouter.use('/searchUsers', controller('searchUser').router)
  apiRouter.use('/statistics', controller('statistic').router)
  apiRouter.use('/friendsMatches', controller('friendsMatch').router)
  apiRouter.use('/questions', controller('question').router)
  apiRouter.use('/friendGames', controller('friendGame').router)
  apiRouter.use('/favouriteQuestions', controller('favouriteQuestion').router)
  apiRouter.use('/userBadges', controller('userBadge').router)
  apiRouter.use('/badges', controller('badge').router)
  apiRouter.use('/examEntities', controller('examEntity').router)
  apiRouter.use('/courseEntities', controller('courseEntity').router)
  apiRouter.use('/subjectEntities', controller('subjectEntity').router)
  apiRouter.use('/userJokers', controller('userJoker').router)
  apiRouter.use('/notifications', controller('notification').router)
  apiRouter.use('/leaderboards', controller('leaderboard').router)
  apiRouter.use('/gameEnergies', controller('gameEnergy').router)
  apiRouter.use('/userScores', controller('userScore').router)
  apiRouter.use('/userGoals', controller('userGoal').router)
  apiRouter.use('/purchaseReceipts', controller('purchaseReceipt').router)
  apiRouter.use('/inviteCodes', controller('inviteCode').router)
  apiRouter.use('/report', controller('reportedUser').router)
  apiRouter.use('/agreement', controller('agreement').router)

  router.use(`/api/${config.version}`, apiRouter)

  router.use(partialRight(errorHandler, [logger, config]))

  return router
}
