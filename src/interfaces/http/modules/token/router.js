const Status = require('http-status')
const { Router } = require('express')

module.exports = ({
  postUseCase,
  getUserUseCase,
  getAppleIdentityTokenUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  router
    .post('/', (req, res) => {
      if (req.query.signInMethod === 'apple') {
        getAppleIdentityTokenUseCase
          .getOne({ identityToken: req.body.identityToken })
          .then(data => {
            if (data === null) throw new Error('Invalid Credentials')

            // dataValues is the user information
            const { dataValues } = data.user

            postUseCase
              .validate({ body: {
                email: dataValues.email,
                password: req.body.password
              },
              deviceId: req.query.deviceId })
              .then(data => {
                res.status(Status.OK).json(Success(data))
              })
              .catch((error) => {
                logger.error(error.stack) // we still need to log every error for debugging
                res.status(Status.BAD_REQUEST).json(
                  Fail(error.message))
              })
          })
          .catch((error) => {
            logger.error(error.stack)
            res.status(Status.BAD_REQUEST).json(
              Fail(error.message))
          })
      } else {
        postUseCase
          .validate({ body: req.body, deviceId: req.query.deviceId })
          .then(data => {
            res.status(Status.OK).json(Success(data))
          })
          .catch((error) => {
            logger.error(error.stack) // we still need to log every error for debugging
            res.status(Status.BAD_REQUEST).json(
              Fail(error.message))
          })
      }
    })

  router.use(auth.authenticate())

  // If the token is not valid, user sends a post request to /token to get a valid token
  router
    .get('/:id', (req, res) => {
      getUserUseCase
        .getOne({ id: req.params.id })
        .then(data => {
          const { dataValues } = data

          if (req.query.deviceId === dataValues.deviceId) res.status(Status.OK).json(Success())
          else res.status(Status.OK).json(Fail())
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  return router
}
