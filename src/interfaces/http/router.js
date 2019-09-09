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
  if (config.env !== 'test') {
    router.use(httpLogger(logger))
  }

  const apiRouter = Router()

  apiRouter
    .use(cors({
      origin: [
        'http://localhost:3000'
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

  router.use(`/api/${config.version}`, apiRouter)

  router.use(partialRight(errorHandler, [logger, config]))

  return router
}
