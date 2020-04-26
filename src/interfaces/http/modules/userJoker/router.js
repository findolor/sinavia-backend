const Status = require('http-status')
const { Router } = require('express')
const moment = require('moment')
moment.locale('tr')

module.exports = ({
  getUserJokerUseCase,
  putUserJokerUseCase,
  logger,
  auth,
  response: { Success, Fail }
}) => {
  const router = Router()

  router.use(auth.authenticate())

  // Gets the user jokers from db
  router
    .get('/:userId', (req, res) => {
      getUserJokerUseCase
        .getJokers({ userId: req.params.userId })
        .then(data => {
          data.forEach(userJoker => {
            const renewedDate = moment(userJoker.dateRenewed).format('MDD')
            const currentDate = moment().format('MDD')

            if (currentDate > renewedDate) {
              if (userJoker.shouldRenew) {
                // 10 is the given joker count for every player
                // If joker is less then 10 we subtract the number from 10 and add that amount
                // If it is equal to 10 and more we add 10
                if (userJoker.amountUsed < 10) {
                  userJoker.amount += userJoker.amountUsed
                } else userJoker.amount += 10
                // We mark shouldRenew false
                userJoker.shouldRenew = false
                // We mark the new date
                userJoker.dateRenewed = new Date()
                // We mark usedEnergy after renewing to 0
                userJoker.amountUsed = 0

                putUserJokerUseCase
                  .updateUserJoker({ userJokerEntity: userJoker })
                  .catch(error => {
                    logger.error(error.stack)
                    res.status(Status.BAD_REQUEST).json(Fail(error.message))
                  })
              } else {
                userJoker.dateRenewed = new Date()

                putUserJokerUseCase
                  .updateUserJoker({ userJokerEntity: userJoker })
                  .catch(error => {
                    logger.error(error.stack)
                    res.status(Status.BAD_REQUEST).json(Fail(error.message))
                  })
              }
            }
          })
          res.status(Status.OK).json(Success(data))
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  router
    .put('/reward/all/:userId', (req, res) => {
      getUserJokerUseCase
        .getJokers({ userId: req.params.userId })
        .then(data => {
          data.forEach(userJoker => {
            userJoker.amount += 2

            putUserJokerUseCase
              .updateUserJoker({ userJokerEntity: userJoker })
              .catch(error => {
                logger.error(error.stack)
                res.status(Status.BAD_REQUEST).json(Fail(error.message))
              })
          })
          res.status(Status.OK).json(Success(data))
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

  router
    .put('/reward/:userId', (req, res) => {
      getUserJokerUseCase
        .getOne({ userId: req.params.userId, jokerId: req.body.jokerId })
        .then(data => {
          const { dataValues } = data
          data = dataValues

          data.amount += req.body.jokerAmount

          putUserJokerUseCase
            .updateUserJoker({ userJokerEntity: data })
            .then(() => {
              res.status(Status.OK).json(Success(data))
            })
            .catch(error => {
              logger.error(error.stack)
              res.status(Status.BAD_REQUEST).json(Fail(error.message))
            })
        })
        .catch((error) => {
          logger.error(error.stack) // we still need to log every error for debugging
          res.status(Status.BAD_REQUEST).json(
            Fail(error.message))
        })
    })

      router
    .put('/purchaseBundle/:userId', (req, res) => {
      getUserJokerUseCase
        .getJokers({ userId: req.params.userId })
        .then(data => {
          data.forEach(userJoker => {
            userJoker.amount += req.body.jokerAmount

            putUserJokerUseCase
              .updateUserJoker({ userJokerEntity: userJoker })
              .catch(error => {
                logger.error(error.stack)
                res.status(Status.BAD_REQUEST).json(Fail(error.message))
              })
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
